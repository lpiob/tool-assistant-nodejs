import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import axios from 'axios';
import ical from 'ical';
import moment from 'moment';
import pkg from 'rrule';
const { RRule } = pkg;

export const getWeekSchedule = new DynamicStructuredTool({
  name: "getWeekSchedule",
  description: "returns user calendar/schedule for 7 days from now",
  schema: z.object({}),
  func: async({})=>{
    console.log("Fetching events from calendar");
    try {
      const icsUrl = process.env.ICS_URL;
      const response = await axios.get(icsUrl);
      const icsData = response.data
      const events = ical.parseICS(icsData);

      // Get today's date
      const today = moment().startOf('day');
      const nextweek = moment(today).add(7, 'days');
      const todaysEvents = [];
        for (let event of Object.values(events)) {
            if (event.type === 'VEVENT') {
                if (event.rrule) {
                    // Handle recurring events
                    const rule = new RRule.fromString(event.rrule.toString());
                    const dates = rule.between(today.toDate(), nextweek.toDate(), true);
                    if (dates.length > 0) {
                        dates.forEach(date => {
                            todaysEvents.push({
                                summary: event.summary,
                                start: moment(date).format('YYYY-MM-DD HH:mm'),
                                end: moment(date).add(moment(event.end).diff(event.start)).format('YYYY-MM-DD HH:mm'),
                            });
                        });
                    }
                } else {
                    // Handle non-recurring events
                    const start = moment(event.start);
                    const end = moment(event.end);
                    if ((start.isSameOrAfter(today) && start.isBefore(nextweek)) ||
                        (end.isSameOrAfter(today) && end.isBefore(nextweek)) ||
                        (start.isBefore(today) && end.isAfter(today))) {
                        todaysEvents.push({
                            summary: event.summary,
                            start: start.format('YYYY-MM-DD HH:mm'),
                            end: end.format('YYYY-MM-DD HH:mm'),
                        });
                    }
                }
            }
        }

      const weekevents = [];
      todaysEvents.forEach(event => {
          weekevents.push(`<event><name>${event.summary}</name><start>${event.start}</start><end>${event.end}</end><location>${event.location}</location></event>`); 
      });
      return weekevents.join('');
    } catch (error) {
      return("There was an error while fetching the calendar events: "+error);
    };
  },
});

