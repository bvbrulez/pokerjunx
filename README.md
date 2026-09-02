# Pokerjunx

Statische GitHub-Pages-Homepage der Pokerjunx: fünf Freunde, gemeinsame Wochenenden
und eine Übersicht vergangener Touren unter „On Tour“.

Die Tourfotos stammen aus Wikimedia Commons: [Steinhuder Meer](https://commons.wikimedia.org/wiki/File:SteinhuderMeer.jpg)
und [Almudín in Valencia](https://commons.wikimedia.org/wiki/File:The_Almud%C3%ADn_and_Fuente_de_San_Lluis_Bertran_in_Ciutat_Vella,_Valencia,_Spain.jpg).

## Commit-Messages

Das Repository verwendet Conventional Commits. Den Hook einmalig für dieses Repository aktivieren:

```sh
git config core.hooksPath .githooks
chmod +x .githooks/commit-msg
```

Erlaubte Formate sind beispielsweise `feat: neue Funktion`, `fix: fehler beheben` oder `docs: README aktualisieren`. Der passende Git-Hook für die Prüfung einer Commit-Message heißt `commit-msg`; `pre-commit` erhält die Commit-Message noch nicht.

Der `pre-push`-Hook ergänzt neue Commit-Messages automatisch in `CHANGELOG.md`. Falls dadurch ein Changelog-Commit erstellt wird, muss der Push einmal wiederholt werden:

```sh
chmod +x .githooks/pre-push
```
