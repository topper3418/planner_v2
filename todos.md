# LEARNING TODOS

- [X] make a clean pydantic integration with .env
- [/] make a clean pydantic integration with db, using orm mode or whatever
  - [X] proompt a CRUD interface for each model
- [X] integrate it all with fastapi
- [ ] incorporate querybuilder into all db interactions 


## STRUCTURE

- [X] track "things" to put the tickets agains
- [X] there should be categories for those things
- [X] should "tickets" be things that are wrong with the thing, or things to do with the thing?


## API

- [X] set up proxy in vite that will be plug and play for nginx
- [X] figure out why the view query works in the raw but not in the api
- [X] make a simple log view


## BUGS

- [X] make it so that the thing tree starts with nothing checked and everything expanded
- [X] make it so that the table responds to the checking of the tree
- [X] fix the way that dbcore attaches the logger
- [X] thing not highlighting on the tree
- [X] selected ticket not highlighting on the table
- [X] add ticket button seems to do nothing at url: http://localhost:5173/{thing_id}


## USAGE

- [ ] ticketview
  - [ ] just show a table with the important stuff, make a row of inputs across the top for filtering, or figure out how to integrate with the api
  - [ ] should be able to view a list of tickets
    - [ ] should be able to filter by various things, including "things"
    - [ ] should be able to sort by various things
- [ ] there should be a server through which you can send notes and stuff
  - [ ] first and foremost, they should go into a message buffer. 
- [X] ugh there should be a frontend too. I guess try to make it with a react project
  - [/] keep it no more complicated than topperud-todos
  - [X] should be able to see a list of all things, and click each to see its tickets
- [X] make it so that in the tree, it shows number of tickets for each thing
- [ ] fix styling
  - [ ] margins should be minimal, there is too much wasted space
  - [ ] there should be absolutely no scrolling necessary
- [ ] make pagination work on the tables
- [ ] add a "show child tickets" button on the ticket table
- [ ] add combined action and comment feed on the main page
- [ ] add a way to add tickets from the main view, without selecting a thing. Thing should be selectable via a treeselect


## FUTURE

 - [ ] add pictures
 - [ ] make ios app

