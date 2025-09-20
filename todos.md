# LEARNING TODOS

- [ ] make a clean pydantic integration with .env
- [/] make a clean pydantic integration with db, using orm mode or whatever
  - [X] proompt a CRUD interface for each model
- [X] integrate it all with fastapi


## STRUCTURE

- [X] track "things" to put the tickets agains
- [X] there should be categories for those things
- [X] should "tickets" be things that are wrong with the thing, or things to do with the thing?


## API

- [ ]  set up proxy in vite that will be plug and play for nginx


## USAGE

- [ ] ticketview
  - [ ] just show a table with the important stuff, make a row of inputs across the top for filtering, or figure out how to integrate with the api
  - [ ] should be able to view a list of tickets
    - [ ] should be able to filter by various things, including "things"
    - [ ] should be able to sort by various things
- [ ] there should be a server through which you can send notes and stuff
  - [ ] first and foremost, they should go into a message buffer. 
- [ ] ugh there should be a frontend too. I guess try to make it with a react project
  - [ ] keep it no more complicated than topperud-todos
