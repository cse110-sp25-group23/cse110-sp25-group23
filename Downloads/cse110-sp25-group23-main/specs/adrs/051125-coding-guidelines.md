## Code Style Guidelines

### Functions:
1. *Prove definitions for each function (description of functionality)*
2. *Use commenting style detected by <ins>**jsDocs**</ins>
   - Example:
     ```
     /**
     *
     * Comment should start for each function or the comments you wish to be included in the official documentation
     * with one slash and 2 stars in the following manner
     *
     */
    - Use @param tag to define each parameter's type and its purpose within the respective function
    - Use @returns tag to define the type and purpose of what the function is returning
    - Use @typedef tag for object you defined
    - Use @property tag for object's specific properties and their purpose
    - TUTORIAL: [Link Youtube Tutorial for jsDocs](https://youtu.be/oH_-6TyxVhI?feature=shared)
      
### Variables:
1. *Avoid abbreviations (undescriptive) variable names*
2. *Initialize all function-based variables in the beginning of the codeblock respectively*

### Standard conventions:
+ ***kebab-casing → for Git file names***
  + Example: 051025-meeting-notes.md
- ***Global constants should be all uppercase***
  - Example: `NUMBER_OF_DAYS_IN_WEEK = 7;`
* ***CamelCase for variables and functions***
  * Example: `numberOfDays = 7;`
+ ***No code line should be greater than 100 characters for easier readability***
  + Instructions:
    1. Open VSCode: Launch your Visual Studio Code editor.
    2. Access Settings: Click on the gear icon in the lower-left corner and select 'Settings' from the menu.
    3. Search for 'Editor Rulers': Type 'editor rulers' in the search bar at the top of the Settings panel.
    4. Edit Rulers: Click on 'Edit in settings.json' to open the settings file. Add the following line:
       "editor.rulers": [100]
    5. Save Changes: Save the changes to the settings.json file and close it. You should now see the vscode line length indicator in your editor.feature in VS Code that helps mark the line length

- ***Indentations- use tab or 4 spaces***
  - Example:
    ```
    foo {
      string wordExample = "Yay";
    }
    ```
* ***For strings, use double quotes***
  * Example: `"Yay!"`
+ ***Place curly braces on the same line where function and if-statement starts***
  + Example:
    ```
    function {
     ...
    }
    ```
- ***General Tips***
  - Better to over-explain than assumed under explanation
  - Try to reuse code by creating a function if chunks of code are repeated multiple times throughout the codebase


## Note: 
  Our team had discussed and set these conditions down to create consistency across the board when we are working on various sections.
