# A Task Manager Tool

As final project of this repository/course, I would like to create a simple task manager application like Jira, combining RxJs with another useful tool to manage browser's built-in database IndexDb, that is [**Dexie**](https://dexie.org).

Using the application requires to be authenticated, that is, to be previously registered in it. As soon as you completed the auth part, the application is divider in three main sections:

- The _Project_ section ables the user to create a new project having a title, a description, a starting and an ending date.
- Once you have created a new project, you can start to create new _tasks_. Each task must be associated to a project, and can assume three different states: _ToDo_, _In Progress_ and _Completed_. Finally a new task must be associated to a registered user.
- Finally, in _Statistics_ section you can have a look about the main statistics of the project. This section have been realized using [**Chart.js**](https://www.chartjs.org).

I hope that you found this project as a useful example of how RxJs can be used in Angular applications, and feel free to clone the repository customizing it.

Good luck!
