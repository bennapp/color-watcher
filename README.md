# color-watcher (aka Ferrari Picasso)

## Desktop app that will poll your screen for colors.

I started off sampling the entire screen and maping it into pixels in a webview.

So turning this:
<img width="1787" alt="Screen Shot 2022-01-15 at 12 12 49 PM" src="https://user-images.githubusercontent.com/2433091/149634937-719da7e3-359e-4a7a-93e1-aac7e63f48d7.png">

into this:
![Screen Shot 2022-01-15 at 12 12 42 PM](https://user-images.githubusercontent.com/2433091/149634944-d5845bd8-c080-4eb4-84ff-3a13bfdaedbf.png)

And then I decided instead to only sample pixels around the border of the screen and then map those into an led strip! (but the led updates were slow b/c I was sending the data to the Arduino in a dumb way and updating the led strip had an annoying slow-updating raster-effect)

![colorwatcher](https://user-images.githubusercontent.com/2433091/149700996-3b285906-9d0f-4578-87a6-166ddb252196.jpg)

SO THEN! I decided to improve the I/O and add a slow color transition effect to really set the mood XD.

[![Youtube video of led strip transitions](http://img.youtube.com/vi/XLQfzb2OnuU/0.jpg)](http://www.youtube.com/watch?v=XLQfzb2OnuU "Color fade ambient lighting")

and now I'm probably done writing c code for another decade :-P


## Technical details / how it works
1) An electron app uses `robotjs` to scan some set of sample coordinates randomly in a loop visiting each sample-coord exactly once. In this case the sample coordinates are 80 pixels around the right, top and left border of the screen.
2) The electron app uses `serial.js` to send the color data along a usb port to an Arduino. The color data is 8-bytes encoded as such, `[rgbi]`, where i is the index of a light on the led strip and rgb are the hex color values. Each value is encoded as a hex string. So all purple (max r and b) at pixel 5 looks like `"FF00FF05"`.
3) The Arduino runs a loop that first looks for data on the serial buffer. It will split the message and pipe that data into `uint32_t[]` called `stripBuffer`. So that has to decode the hex colors into a `uint32_t`. 
4) When there is no message available, it will then compare each index of `stripBuffer` to another `uint32_t` array called `stripMemory`. 
5) If the color value at the index differs (between the buffer and the memory of the led strip) it will adjust `stipMemory` for each rbg value by the `(difference / 10) || 1` (this is the fade transition), then will update the actual led strip with the value in `stripMemory`! :D
