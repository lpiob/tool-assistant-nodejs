# AI Assistant with Tools

Rozserzalny PoC demonstrujący wykorzystanie narzędzi w frameworku langchains.

Materiał uzupełniający do prelekcji SO/DO Kraków 2024.06.20 <https://www.meetup.com/pl-PL/sysopskrk/events/301133130/>.

## Wykorzystanie

Wymagane zmienne środowiskowe:
```
export TAVILY_API_KEY=<api key od tavily>
export OPENAI_API_KEY=<api key od openai>
export ICS_URL=<link http do kalendarza w formacie ICS>
```

instalacja zaleznosci przez `npm install` i uruchomienie przez `node main.mjs`

## Uwagi

Kod nie posiada ŻADNYCH zabezpieczeń przed prompt injection i command injection i nie powinien być używany produkcyjnie, w szczególności nie powinien być używany w sytuacjach gdy interakcja jest inicjowana przez osobę trzecią.

Kod został publikowany jako demonstracja i baza pod dalszą rozbudowę.
