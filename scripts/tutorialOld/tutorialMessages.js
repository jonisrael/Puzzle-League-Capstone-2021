import { tutorialMessages4 } from "./states/state4";

export const tutorialMessages = [
  [
    "Welcome, and thank you for trying my game!", // 0
    "There are two parts to the first tutorial, and should take around 3-5 minutes.",
    "Let's get started!",
  ],
  [
    "BASICS <br>(Click To Continue)",
    "To play, swap blocks horizontally left or right. Blocks will fall vertically.", // 1
    "Match 3 of the same color to gain points. This is called a set.", // 2
    "Go ahead and try it! Select a block by touching it, and hold your finger on it.", // 3
    "Good! Now drag the block over here and let go of the screen to move it", // 4
    "Now they are clearing, and you gained 30 points!", // 5
    "Try clearing 4 at once by moving this block.",
    "Beautiful! 60 points!",
    "Now see if you can create a 5 set. But which cyan block should you move first?",
    "There it is! 90 points!",
    "Can you figure out how to create a clear 8?",
    "And there's the payoff! Look at all those points! Now for a challenge...",
  ],
  [
    "Can you make a 10 set within 5 moves?", // 0
    "Out of moves! Try again!",
    "Clear too small, you must clear 10 at the same time!",
    "You can enable a hint to help solve this puzzle.",
    "Fantastic! You have now mastered how to create large matches!",
    "Nicely done, let's move on.",
    "Nicely done, let's move on.",
  ],
  [
    "CHAINS PART 1/2",
    "The sets we created are good... but chains are an even faster way to gain score.",
    "Chains occur when, after a set clears, a block above lands onto another.",
    "It sounds more confusing than it actually is, so let's break it down.",
    "Let's look at these three similar blocks. They are highlighted below.",
    "If we could clear the row in between, then they would land and form a set!",
    "We can clear this row by moving this block over here. Do that now!",
    "OK! Now when the blocks clear...",
    "a chain will be made!",
    "a chain will be made!",
    "a chain will be made!",
    "Perfect! We just created a 2 chain.",
    "The score gained was 30 for set 1 and 130 for set 2, so 160 points total.",
  ],
  [
    "CHAINS PART 2/2",
    "We are now going to set up a large chain of 4. Don't worry, I will guide you through it!",
    "Before we make our clear, lets set up the 2x chain by aligning the blocks along a column.",
    "Now, let's create our match to form a 2x chain.",
    "Great! Let's wait a moment for it to clear...",
    "2x!",
    "But we are not done yet! Quickly, move this block here and make a third chain.",
    "But we are not done yet! Quickly, move this block here and make a third chain.",
    "3x!",
    "Move ANY blue block over to set up a 4x chain",
    "Move ANY blue block over to set up a 4x chain",
    "4x!",
    "Incredible Technique! 720 points!",
    "You can see that with each extra chain, the points grow exponentially.",
    "We ran out of moves here, but it is possible to clear this whole board in one chain.",
    `See if you can do it in the "Chain Challenge!"`,
  ],
  // [
  //   "BUFFERED SWAP DEMONSTRATION",
  //   "I developed a mechanic called buffered swapping.",
  //   "Buffered swapping allows you to prepare a block to move to a location as soon as available",
  //   "You can use this to set up multiple chains around the board at once.",
  //   "Watch me!",
  // ],
  // [
  //   "SMART MATCH DEMONSTRATION",
  //   "You may have noticed when playing that blocks will sometimes light up",
  //   `This is a mechanic I programmed specifically for this game called "Smart Match"`,
  //   `I developed it to help players get chains easier and improve accessability for touch screen.`,
  //   `First I am going to clear this block, and then I am going to form a chain.`,
  //   `Simple, you probably know how to do this.`,
  //   `However, I am going to increase the game speed to overtime, and will be very fast.`,
  //   `Now doing the same thing again is tricky. `,
  //   `I accidentally was off by one and missed my opportunity for a chain.`,
  //   `However, with smart match, I do not need to worry about precision`,
  //   `As long as I see the chain, I can simply flick the block from one side of the board to the other...`,
  //   `And it will automatically stop it for me!`,
  //   `Mastering this system will allow you to move very quickly.`,
  //   `If you find it annoying, you can also disable it in the options menu.`,
  // ],

  // [
  //   `ARCADE RULES AND SURVIVING (4/4)`,
  //   "This next part is a lot more reading then playing, but we are almost done!",
  //   "We also get to watch Floyd, the AI I excitedly created just for this game.",
  //   "For the tutorial I am weakening it by slowing the speed the AI moves around...",
  //   "But if you select watching the cpu play from the main menu, you'll see that it is very fast",
  //   "ANYWAY, in this game, you lose when the stack hits the top.",
  //   "In arcade, the level increases every 20 seconds, and so does game speed and score earned.",
  //   "At two minutes in arcade, the board rise speed triples! This is called overtime.",
  //   "In overtime, you will also gain score by surviving, and all points earned are doubled.",
  //   "Let's see how long Floyd lasts when we crank up the speed to overtime...",
  //   "Ouch! The AI didn't stand a chance.",
  //   "It looks hard to survive, but there are ways to mitigate this.",
  //   "There are two main ways to fight the stack rise -- clearing blocks and flattening the stack",
  //   "First, if a block is clearing, the stack will stop rising, plain and simple.",
  //   "And second, flattening the stack gives yourself more space.",
  //   "Moreover, the stack will also stop moving while a block is airborne.",
  //   "There is also another game mechanic called raise delay, but that is for a later tutorial.",
  //   "You can self-raise the stack by double tapping any vacant block. Raise it 4 lines please.",
  //   "And that's all! Go show the world what you are made of.",
  // ],
];
