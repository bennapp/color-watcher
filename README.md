# color-watcher

Electron app that will poll your screen for colors.

I started off sampling the entire screen and maping it into pixels in a webview. So

turns this:
<img width="1787" alt="Screen Shot 2022-01-15 at 12 12 49 PM" src="https://user-images.githubusercontent.com/2433091/149634937-719da7e3-359e-4a7a-93e1-aac7e63f48d7.png">

into this:
![Screen Shot 2022-01-15 at 12 12 42 PM](https://user-images.githubusercontent.com/2433091/149634944-d5845bd8-c080-4eb4-84ff-3a13bfdaedbf.png)

and then I decided instead to only sample pixels around the border of the screen and then map those into an led strip!

![colorwatcher](https://user-images.githubusercontent.com/2433091/149700996-3b285906-9d0f-4578-87a6-166ddb252196.jpg)

the LEDs react in real time!
