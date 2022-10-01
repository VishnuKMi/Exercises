// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract TodoList {

    struct TodoItem {
        string text;
        bool completed;
    }

     //create an array of structs
    TodoItem[] public todos;

    function createTodo(string memory _text) public {
        todos.push(TodoItem(_text, false));

    }

    //update a struct
    function update(uint _index, string memory _text) public {
        todos[_index].text = _text;
    }

    //update completed
    function toggleCompleted(uint _index) public {
        todos[_index].completed = !todos[_index].completed;
    }
}
