# Final project, Task Manager

This is our final project for this repository, we will create an offline application for task managing using Angular, **RxJs** and [**IndexedDb**](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Hereafter we are going to describe shortly what and how the application should do:

> We would like to create an offline application where users can track tasks. We can create both single users that would like to use the application for their personal purposes, or groups of users belonging to the same enterprise. Each user can create, update or delete an assigned task. Moreover, a task will be identified by a title and a description, and can be assigned to a the creator or to another user of the same enterprise.

I want to create this application step by step, hereafter, I will slipt the initial description in different conceptual areas, and then, expand each section with more conceptual and technical details, in a certain sense I would like to use an [**Agile approach**](https://en.wikipedia.org/wiki/Agile_software_development).

## Authenticating a user

Let's suppose that we have two types of users, the former is a standard user that want to use the application for their personal purposes, on the other hand, the latter is a user belonging to an enterprise. Each user belonging to the same enterprise can use the application together. Moreover, each user must create an account, that is, must have a username and a password, in addiction to their personal information. Therefore, we can sum up these information using the following diagram:

<p align="center">
    <img src="./doc/assets/(Authentication) - ER Diagram.svg" alt="Authentication a user" style="width:70%">
</p>

there are basically two actions that can be done in this step, you can sign in the application or sign up, if you did not do that previously. Signing up requires to specify what will be you purpose, if you are a private user, you have to provide only you personal information, and then chose a password, base on a set of criteria. On the other hand, if you belongs to an enterprise, you can choose the name of it from a list of registered enterprises, moreover, you can register your enterprise with you if you did not do it previously.
