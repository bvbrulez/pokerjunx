# Pokerjunx

Statische GitHub-Pages-Homepage der Pokerjunx: fünf Freunde, gemeinsame Wochenenden
und eine Übersicht vergangener Touren unter „On Tour“.

Das Tourfoto des Steinhuder Meers stammt aus [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:SteinhuderMeer.jpg).

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
