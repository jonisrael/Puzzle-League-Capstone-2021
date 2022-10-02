// Import Image Sprites
import CURSOR from ".././assets/Sprites/cursors/default_cursor.png";
import CURSOR_ORANGE from ".././assets/Sprites/cursors/default_cursor_orange.png";
import CURSOR_PINK from ".././assets/Sprites/cursors/default_cursor_pink.png";
import CURSOR_DARK_GREY from ".././assets/Sprites/cursors/default_cursor_grey.png";
import CURSOR_LIGHT_GREY from ".././assets/Sprites/cursors/default_cursor_light_grey.png";
import LEGAL_SELECTION_CURSOR from ".././assets/Sprites/cursors/selected_cursor.png";
import ILLEGAL_SELECTION_CURSOR from ".././assets/Sprites/cursors/invalid_selection_cursor.png";
import SELECTABLE_CURSOR from ".././assets/Sprites/cursors/selectable_cursor.png";
import MOVING_CURSOR from ".././assets/Sprites/cursors/selectable_cursor_pink.png";
import UNSELECTABLE_CURSOR from ".././assets/Sprites/cursors/unselectable_cursor.png";
import GRID_LINE from ".././assets/Sprites/grid_line.png";
import GRID_LINE_RED from ".././assets/Sprites/grid_line_red.png";
import GRID_WARNING_TOP from ".././assets/Sprites/grid_warning_top.png";
import GRID_WARNING_MID from ".././assets/Sprites/grid_warning_middle.png";
import GRID_WARNING_BOT from ".././assets/Sprites/grid_warning_bottom.png";
import ROW_LIGHT_LEFT from ".././assets/Sprites/row_light_left.png";
import ROW_LIGHT_MID from ".././assets/Sprites/row_light_mid.png";
import ROW_LIGHT_RIGHT from ".././assets/Sprites/row_light_right.png";
import LIGHT from ".././assets/Sprites/lightThick.png";
import PINK_LIGHT from ".././assets/Sprites/pinkLight.png";
import ORANGE_LIGHT from ".././assets/Sprites/orangeLight.png";
import L_ARROW_START_ORANGE from ".././assets/Sprites/arrows/orange/leftArrowStartOrange.png";
import L_ARROW_START_PINK from ".././assets/Sprites/arrows/pink/leftArrowStartPink.png";
import L_ARROW_START_MAGENTA from ".././assets/Sprites/arrows/magenta/leftArrowStartMagenta.png";
import L_ARROW_START_DARK from ".././assets/Sprites/arrows/dark/leftArrowStartDark.png";
import L_ARROW_START_GREY from ".././assets/Sprites/arrows/grey/leftArrowStartGrey.png";
import L_ARROW_END_ORANGE from ".././assets/Sprites/arrows/orange/leftArrowEndOrange.png";
import L_ARROW_END_PINK from ".././assets/Sprites/arrows/pink/leftArrowEndPink.png";
import L_ARROW_END_DARK from ".././assets/Sprites/arrows/dark/leftArrowEndDark.png";
import L_ARROW_END_GREY from ".././assets/Sprites/arrows/grey/leftArrowEndGrey.png";
import L_ARROW_END_MAGENTA from ".././assets/Sprites/arrows/magenta/leftArrowEndMagenta.png";
import R_ARROW_START_ORANGE from ".././assets/Sprites/arrows/orange/rightArrowStartOrange.png";
import R_ARROW_START_PINK from ".././assets/Sprites/arrows/pink/rightArrowStartPink.png";
import R_ARROW_START_DARK from ".././assets/Sprites/arrows/dark/rightArrowStartDark.png";
import R_ARROW_START_GREY from ".././assets/Sprites/arrows/grey/rightArrowStartGrey.png";
import R_ARROW_START_MAGENTA from ".././assets/Sprites/arrows/magenta/rightArrowStartMagenta.png";
import R_ARROW_END_ORANGE from ".././assets/Sprites/arrows/orange/rightArrowEndOrange.png";
import R_ARROW_END_PINK from ".././assets/Sprites/arrows/pink/rightArrowEndPink.png";
import R_ARROW_END_DARK from ".././assets/Sprites/arrows/dark/rightArrowEndDark.png";
import R_ARROW_END_GREY from ".././assets/Sprites/arrows/grey/rightArrowEndGrey.png";
import R_ARROW_END_MAGENTA from ".././assets/Sprites/arrows/magenta/rightArrowEndMagenta.png";
import H_ARROW_MID_ORANGE from ".././assets/Sprites/arrows/orange/midArrow.png";
import H_ARROW_MID_PINK from ".././assets/Sprites/arrows/pink/midArrowPink.png";
import H_ARROW_MID_DARK from ".././assets/Sprites/arrows/dark/midArrowDark.png";
import H_ARROW_MID_GREY from ".././assets/Sprites/arrows/grey/midArrowGrey.png";
import H_ARROW_MID_MAGENTA from ".././assets/Sprites/arrows/magenta/midArrowMagenta.png";
import D_ARROW_START_ORANGE from ".././assets/Sprites/arrows/orange/downArrowStart.png";
import D_ARROW_START_PINK from ".././assets/Sprites/arrows/pink/downArrowStartPink.png";
import D_ARROW_START_DARK from ".././assets/Sprites/arrows/dark/downArrowStartDark.png";
import D_ARROW_START_GREY from ".././assets/Sprites/arrows/grey/downArrowStartGrey.png";
import D_ARROW_START_MAGENTA from ".././assets/Sprites/arrows/magenta/downArrowStartMagenta.png";
import D_ARROW_MID_ORANGE from ".././assets/Sprites/arrows/orange/downMidArrow.png";
import D_ARROW_MID_PINK from ".././assets/Sprites/arrows/pink/downMidArrowPink.png";
import D_ARROW_MID_DARK from ".././assets/Sprites/arrows/dark/downMidArrowDark.png";
import D_ARROW_MID_GREY from ".././assets/Sprites/arrows/grey/downMidArrowGrey.png";
import D_ARROW_MID_MAGENTA from ".././assets/Sprites/arrows/magenta/downMidArrowMagenta.png";
import D_ARROW_END_ORANGE from ".././assets/Sprites/arrows/orange/downArrowEnd.png";
import D_ARROW_END_PINK from ".././assets/Sprites/arrows/pink/downArrowEndPink.png";
import D_ARROW_END_DARK from ".././assets/Sprites/arrows/dark/downArrowEndDark.png";
import D_ARROW_END_GREY from ".././assets/Sprites/arrows/grey/downArrowEndGrey.png";
import D_ARROW_END_MAGENTA from ".././assets/Sprites/arrows/magenta/downArrowEndMagenta.png";
import LtD_ARROW_ORANGE from ".././assets/Sprites/arrows/orange/leftToDownArrow.png";
import LtD_ARROW_PINK from ".././assets/Sprites/arrows/pink/leftToDownPink.png";
import LtD_ARROW_DARK from ".././assets/Sprites/arrows/dark/leftToDownDark.png";
import LtD_ARROW_GREY from ".././assets/Sprites/arrows/grey/leftToDownGrey.png";
import LtD_ARROW_MAGENTA from ".././assets/Sprites/arrows/magenta/leftToDownMagenta.png";
import RtD_ARROW_ORANGE from ".././assets/Sprites/arrows/orange/rightToDownArrow.png";
import RtD_ARROW_PINK from ".././assets/Sprites/arrows/pink/rightToDownArrowPink.png";
import RtD_ARROW_DARK from ".././assets/Sprites/arrows/dark/rightToDownArrowDark.png";
import RtD_ARROW_GREY from ".././assets/Sprites/arrows/grey/rightToDownArrowGrey.png";
import RtD_ARROW_MAGENTA from ".././assets/Sprites/arrows/magenta/rightToDownArrowMagenta.png";
import BLINKING_0_B from ".././assets/Sprites/blueTriangle/clearing/0.png";
import BLINKING_1_B from ".././assets/Sprites/blueTriangle/clearing/1.png";
import DARK_B from ".././assets/Sprites/blueTriangle/dark.png";
import DEAD_B from ".././assets/Sprites/blueTriangle/death.png";
import POPPED_B from ".././assets/Sprites/blueTriangle/empty.png";
import SWAPPING_B from ".././assets/Sprites/blueTriangle/swapping.png";
import FACE_B from ".././assets/Sprites/blueTriangle/face.png";
import LANDING_0_B from ".././assets/Sprites/blueTriangle/landing/0.png";
import LANDING_1_B from ".././assets/Sprites/blueTriangle/landing/1.png";
import LANDING_2_B from ".././assets/Sprites/blueTriangle/landing/2.png";
import NORMAL_B from ".././assets/Sprites/blueTriangle/normal.png";
import PANICKING_0_B from ".././assets/Sprites/blueTriangle/panicking/0.png";
import PANICKING_1_B from ".././assets/Sprites/blueTriangle/panicking/1.png";
import PANICKING_2_B from ".././assets/Sprites/blueTriangle/panicking/2.png";
import PANICKING_3_B from ".././assets/Sprites/blueTriangle/panicking/3.png";

import BLINKING_0_C from ".././assets/Sprites/cyanStar/clearing/0.png";
import BLINKING_1_C from ".././assets/Sprites/cyanStar/clearing/1.png";
import DARK_C from ".././assets/Sprites/cyanStar/dark.png";
import DEAD_C from ".././assets/Sprites/cyanStar/death.png";
import SWAPPING_C from ".././assets/Sprites/cyanStar/swapping.png";
import POPPED_C from ".././assets/Sprites/cyanStar/empty.png";
import FACE_C from ".././assets/Sprites/cyanStar/face.png";
import LANDING_0_C from ".././assets/Sprites/cyanStar/landing/0.png";
import LANDING_1_C from ".././assets/Sprites/cyanStar/landing/1.png";
import LANDING_2_C from ".././assets/Sprites/cyanStar/landing/2.png";
import NORMAL_C from ".././assets/Sprites/cyanStar/normal.png";
import PANICKING_0_C from ".././assets/Sprites/cyanStar/panicking/0.png";
import PANICKING_1_C from ".././assets/Sprites/cyanStar/panicking/1.png";
import PANICKING_2_C from ".././assets/Sprites/cyanStar/panicking/2.png";
import PANICKING_3_C from ".././assets/Sprites/cyanStar/panicking/3.png";

import BLINKING_0_G from ".././assets/Sprites/greenCircle/clearing/0.png";
import BLINKING_1_G from ".././assets/Sprites/greenCircle/clearing/1.png";
import DARK_G from ".././assets/Sprites/greenCircle/dark.png";
import DEAD_G from ".././assets/Sprites/greenCircle/death.png";
import SWAPPING_G from ".././assets/Sprites/greenCircle/swapping.png";
import POPPED_G from ".././assets/Sprites/greenCircle/empty.png";
import FACE_G from ".././assets/Sprites/greenCircle/face.png";
import LANDING_0_G from ".././assets/Sprites/greenCircle/landing/0.png";
import LANDING_1_G from ".././assets/Sprites/greenCircle/landing/1.png";
import LANDING_2_G from ".././assets/Sprites/greenCircle/landing/2.png";
import NORMAL_G from ".././assets/Sprites/greenCircle/normal.png";
import PANICKING_0_G from ".././assets/Sprites/greenCircle/panicking/0.png";
import PANICKING_1_G from ".././assets/Sprites/greenCircle/panicking/1.png";
import PANICKING_2_G from ".././assets/Sprites/greenCircle/panicking/2.png";
import PANICKING_3_G from ".././assets/Sprites/greenCircle/panicking/3.png";

import BLINKING_0_P from ".././assets/Sprites/purpleDiamond/clearing/0.png";
import BLINKING_1_P from ".././assets/Sprites/purpleDiamond/clearing/1.png";
import DARK_P from ".././assets/Sprites/purpleDiamond/dark.png";
import DEAD_P from ".././assets/Sprites/purpleDiamond/death.png";
import SWAPPING_P from ".././assets/Sprites/purpleDiamond/swapping.png";
import POPPED_P from ".././assets/Sprites/purpleDiamond/empty.png";
import FACE_P from ".././assets/Sprites/purpleDiamond/face.png";
import LANDING_0_P from ".././assets/Sprites/purpleDiamond/landing/0.png";
import LANDING_1_P from ".././assets/Sprites/purpleDiamond/landing/1.png";
import LANDING_2_P from ".././assets/Sprites/purpleDiamond/landing/2.png";
import NORMAL_P from ".././assets/Sprites/purpleDiamond/normal.png";
import PANICKING_0_P from ".././assets/Sprites/purpleDiamond/panicking/0.png";
import PANICKING_1_P from ".././assets/Sprites/purpleDiamond/panicking/1.png";
import PANICKING_2_P from ".././assets/Sprites/purpleDiamond/panicking/2.png";
import PANICKING_3_P from ".././assets/Sprites/purpleDiamond/panicking/3.png";

import BLINKING_0_R from ".././assets/Sprites/redHeart/clearing/0.png";
import BLINKING_1_R from ".././assets/Sprites/redHeart/clearing/1.png";
import DARK_R from ".././assets/Sprites/redHeart/dark.png";
import DEAD_R from ".././assets/Sprites/redHeart/death.png";
import SWAPPING_R from ".././assets/Sprites/redHeart/swapping.png";
import POPPED_R from ".././assets/Sprites/redHeart/empty.png";
import FACE_R from ".././assets/Sprites/redHeart/face.png";
import LANDING_0_R from ".././assets/Sprites/redHeart/landing/0.png";
import LANDING_1_R from ".././assets/Sprites/redHeart/landing/1.png";
import LANDING_2_R from ".././assets/Sprites/redHeart/landing/2.png";
import NORMAL_R from ".././assets/Sprites/redHeart/normal.png";
import PANICKING_0_R from ".././assets/Sprites/redHeart/panicking/0.png";
import PANICKING_1_R from ".././assets/Sprites/redHeart/panicking/1.png";
import PANICKING_2_R from ".././assets/Sprites/redHeart/panicking/2.png";
import PANICKING_3_R from ".././assets/Sprites/redHeart/panicking/3.png";

import BLINKING_0_Y from ".././assets/Sprites/yellowLightning/clearing/0.png";
import BLINKING_1_Y from ".././assets/Sprites/yellowLightning/clearing/1.png";
import DARK_Y from ".././assets/Sprites/yellowLightning/dark.png";
import DEAD_Y from ".././assets/Sprites/yellowLightning/death.png";
import SWAPPING_Y from ".././assets/Sprites/yellowLightning/swapping.png";
import POPPED_Y from ".././assets/Sprites/yellowLightning/empty.png";
import FACE_Y from ".././assets/Sprites/yellowLightning/face.png";
import LANDING_0_Y from ".././assets/Sprites/yellowLightning/landing/0.png";
import LANDING_1_Y from ".././assets/Sprites/yellowLightning/landing/1.png";
import LANDING_2_Y from ".././assets/Sprites/yellowLightning/landing/2.png";
import NORMAL_Y from ".././assets/Sprites/yellowLightning/normal.png";
import PANICKING_0_Y from ".././assets/Sprites/yellowLightning/panicking/0.png";
import PANICKING_1_Y from ".././assets/Sprites/yellowLightning/panicking/1.png";
import PANICKING_2_Y from ".././assets/Sprites/yellowLightning/panicking/2.png";
import PANICKING_3_Y from ".././assets/Sprites/yellowLightning/panicking/3.png";

// Image Sprites
import UNMATCHABLE from ".././assets/Sprites/unmatchable.png";
import BLINKING_0_V from ".././assets/Sprites/vacantSquare/clearing/0.png";
import BLINKING_1_V from ".././assets/Sprites/vacantSquare/clearing/1.png";
import DARK_V from ".././assets/Sprites/vacantSquare/dark.png";
import DEAD_V from ".././assets/Sprites/vacantSquare/death.png";
import SWAPPING_V from ".././assets/Sprites/vacantSquare/swapping.png";
import POPPED_V from ".././assets/Sprites/vacantSquare/empty.png";
import FACE_V from ".././assets/Sprites/vacantSquare/face.png";
import LANDING_0_V from ".././assets/Sprites/vacantSquare/landing/0.png";
import LANDING_1_V from ".././assets/Sprites/vacantSquare/landing/1.png";
import LANDING_2_V from ".././assets/Sprites/vacantSquare/landing/2.png";
import NORMAL_V from ".././assets/Sprites/vacantSquare/normal.png";
import PANICKING_0_V from ".././assets/Sprites/vacantSquare/panicking/0.png";
import PANICKING_1_V from ".././assets/Sprites/vacantSquare/panicking/1.png";
import PANICKING_2_V from ".././assets/Sprites/vacantSquare/panicking/2.png";
import PANICKING_3_V from ".././assets/Sprites/vacantSquare/panicking/3.png";
import DEBUG_CURSOR from ".././assets/Extras/DebugSprites/cursorDebug.png";
import DEBUGW from ".././assets/Extras/DebugSprites/debugW.png";
import DEBUGP from ".././assets/Extras/DebugSprites/debugP.png";
import DEBUGO from ".././assets/Extras/DebugSprites/debugO.png";
import DEBUGB from ".././assets/Extras/DebugSprites/debugB.png";
import DEBUGR from ".././assets/Extras/DebugSprites/debugR.png";
import DEBUGM from ".././assets/Extras/DebugSprites/debugM.png";
import DEBUGC from ".././assets/Extras/DebugSprites/debugC.png";
import DEBUGG from ".././assets/Extras/DebugSprites/debugG.png";
import DEBUGT from ".././assets/Extras/DebugSprites/debugT.png";
import DEBUGV from ".././assets/Extras/DebugSprites/debugV.png";
import DEBUGY from ".././assets/Extras/DebugSprites/debugY.png";

// Import Music

import POPCORN_SONG from ".././assets/Audio/Music/Themes/popcorn.mp3";
import POPCORN_SONG_EXTENDED from ".././assets/Audio/Music/Themes/popcornExtended.mp3";
import RASHID_SONG from ".././assets/Audio/Music/Themes/rashid.mp3";
import CUB3D_SONG from ".././assets/Audio/Music/Themes/cub3d.mp3";
import PHYSICS_SONG from ".././assets/Audio/Music/Themes/physics.mp3";
import RYU_SONG from ".././assets/Audio/Music/Themes/ryu.mp3";
import SCATMAN_SONG from ".././assets/Audio/Music/Themes/scatman.mp3";
import COLLAPSED_REG_SONG from ".././assets/Audio/Music/Themes/collapsedReg.mp3";
import HUGO_SONG from ".././assets/Audio/Music/Themes/hugo.mp3";
import LIP_SONG from ".././assets/Audio/Music/Themes/lipTheme.mp3";

import STRIKERS_SONG from ".././assets/Audio/Music/Overtime Themes/strikers.mp3";
import GIO_SONG from ".././assets/Audio/Music/Overtime Themes/gio.mp3";
import GRIM_SONG from ".././assets/Audio/Music/Overtime Themes/grim.mp3";
import EDGEWORTH_SONG from ".././assets/Audio/Music/Overtime Themes/edgeworth.mp3";
import SURGE_SONG from ".././assets/Audio/Music/Overtime Themes/surge.mp3";
import WRECKING_BALL_SONG from ".././assets/Audio/Music/Overtime Themes/wreckingball.mp3";
import EXPRESSWAY_SONG from ".././assets/Audio/Music/Overtime Themes/collapsedAllegro.mp3";
import COLLAPSED_OT_SONG from ".././assets/Audio/Music/Overtime Themes/collapsedAllegro.mp3";

import RESULTS_SONG from ".././assets/Audio/Music/Results/results.mp3";
import RESULTS_2_SONG from ".././assets/Audio/Music/Results/results2.mp3";
import TRAINING_SONG from ".././assets/Audio/Music/Themes/training.mp3";

// Import Audio
import ANN_5 from ".././assets/Audio/Announcer/5.mp3";
import ANN_4 from ".././assets/Audio/Announcer/4.mp3";
import ANN_3 from ".././assets/Audio/Announcer/3.mp3";
import ANN_2 from ".././assets/Audio/Announcer/2.mp3";
import ANN_1 from ".././assets/Audio/Announcer/1.mp3";
import ANN_GO from ".././assets/Audio/Announcer/go.mp3";
import ANN_TRAINING_STAGE from ".././assets/Audio/Announcer/training stage.mp3";

import ANN_PICK_UP_PACE from ".././assets/Audio/Announcer/pick up the pace.mp3";
import ANN_ARE_YOU_READY from ".././assets/Audio/Announcer/are you ready.mp3";
import ANN_WATCH_CHAMP_BASK from ".././assets/Audio/Announcer/watch the champ bask in glory.mp3";
import ANN_ONLY_WORD_WORTHY from ".././assets/Audio/Announcer/beautiful thats the only word worthy of such strength.mp3";

import ANN_ALL_THE_GLORY from ".././assets/Audio/Announcer/all the glory goes to the winner.mp3";
import ANN_FAT_LADY_SING from ".././assets/Audio/Announcer/the fat lady is about to sing.mp3";
import ANN_NOT_MUCH_TIME from ".././assets/Audio/Announcer/not much time left.mp3";

import ANN_LETS_KEEP_IT_UP from ".././assets/Audio/Announcer/lets keep it up.mp3";
import ANN_BATTLE_CONTINUES from ".././assets/Audio/Announcer/and the battle continues.mp3";
import ANN_AINT_OVER from ".././assets/Audio/Announcer/it aint over till its over.mp3";
import ANN_PERFECT from ".././assets/Audio/Announcer/perfect.mp3";
import ANN_LETS_GET_STARTED from ".././assets/Audio/Announcer/lets get started.mp3";
import ANN_READY from ".././assets/Audio/Announcer/ready.mp3";
import ANN_NOWS_YOUR_CHANCE from ".././assets/Audio/Announcer/nows your chance.mp3";
import ANN_TRAINING from ".././assets/Audio/Announcer/all the training and practice led up to this very moment.mp3";
import ANN_PAYOFF from ".././assets/Audio/Announcer/and there-s the payoff.mp3";
import ANN_BEAUTIFUL from ".././assets/Audio/Announcer/beautiful.mp3";
import ANN_BRING_US_HOME from ".././assets/Audio/Announcer/bring us home.mp3";
import ANN_BRACE_YOURSELF from ".././assets/Audio/Announcer/brace yourself.mp3";
import ANN_CLEAR from ".././assets/Audio/Announcer/clear.mp3";
import ANN_FANTASTIC_COMBO from ".././assets/Audio/Announcer/fantastic combo.mp3";
import ANN_HOW_MUCH_LONGER from ".././assets/Audio/Announcer/how much longer can this go on.mp3";
import ANN_I_HOPE_READY from ".././assets/Audio/Announcer/i hope you-re ready.mp3";
import ANN_SOMETHING_BIG from ".././assets/Audio/Announcer/i think we-re about to see something big.mp3";
import ANN_CALL_THIS_ONE from ".././assets/Audio/Announcer/i-m almost ready to call this one.mp3";
import ANN_COMBO_INTENSE from ".././assets/Audio/Announcer/i-ve never seen a combo that intense.mp3";
import ANN_ANYTHING_LIKE from ".././assets/Audio/Announcer/i-ve never seen anything like this.mp3";
import ANN_INCRED_BELIEVE from ".././assets/Audio/Announcer/incredible I can-t believe it.mp3";
import ANN_INCRED_TECHNIQUE from ".././assets/Audio/Announcer/incredible technique.mp3";
import ANN_WHAT_POWER from ".././assets/Audio/Announcer/what power.mp3";
import ANN_IS_THE_END from ".././assets/Audio/Announcer/is this it, is this the end.mp3";
import ANN_KO from ".././assets/Audio/Announcer/KO.mp3";
import ANN_ALL_BOILS from ".././assets/Audio/Announcer/it all boils down to these last moments.mp3";
import ANN_ANY_MORE_INTENSE from ".././assets/Audio/Announcer/it doesn-t get any more intense than this.mp3";
import ANN_WONT_BE_LONG from ".././assets/Audio/Announcer/it won-t be long now.mp3";
import ANN_FIREWORKS from ".././assets/Audio/Announcer/looks like we can expect fireworks.mp3";
import ANN_NO_ONE_SEE from ".././assets/Audio/Announcer/no one could have seen that coming.mp3";
import ANN_TEN_SECONDS from ".././assets/Audio/Announcer/ten seconds to destiny.mp3";
import ANN_WORLD_ANTICIPATION from ".././assets/Audio/Announcer/the world is holding its breath in anticipation.mp3";
import ANN_THERE_IT_IS from ".././assets/Audio/Announcer/there it is.mp3";
import ANN_INVINCIBLE from ".././assets/Audio/Announcer/invincible.mp3";
import ANN_NO_DOUBT from ".././assets/Audio/Announcer/no doubt.mp3";
import ANN_COULD_BE_END from ".././assets/Audio/Announcer/this could be the end.mp3";
import ANN_TURN_ALL_AROUND from ".././assets/Audio/Announcer/this could turn it all around.mp3";
import ANN_TIME_MARCHES_ON from ".././assets/Audio/Announcer/time marches on.mp3";
import ANN_UNBELIEVABLE from ".././assets/Audio/Announcer/unbelievable.mp3";
import ANN_NOW_OR_NEVER from ".././assets/Audio/Announcer/watch closely, it-s now or never.mp3";
import ANN_NEVER_FORGET_EVENT from ".././assets/Audio/Announcer/we are never going to forget this event.mp3";
import ANN_WHAT_RUSH from ".././assets/Audio/Announcer/what a rush.mp3";
import ANN_WHERE_COME_FROM from ".././assets/Audio/Announcer/where did that come from.mp3";
import ANN_DESERVE_PRAISE from ".././assets/Audio/Announcer/you deserve praise my friend.mp3";
import ANN_YOU_DONT_SEE_MOVES from ".././assets/Audio/Announcer/you don-t see moves like that everyday folks.mp3";
import ANN_MAKE_NO_MISTAKE from ".././assets/Audio/Announcer/make no mistake there is no doubt.mp3";
import ANN_DECISIVE_STRENGTH from ".././assets/Audio/Announcer/decisive strength.mp3";

import HOLD_IT_1 from ".././assets/Audio/holdIt1.mp3";
import HOLD_IT_2 from ".././assets/Audio/holdIt2.mp3";
import HOLD_IT_3 from ".././assets/Audio/holdIt3.mp3";
import HOLD_IT_4 from ".././assets/Audio/holdIt4.mp3";

import MOVE_CURSOR from ".././assets/Audio/MoveCursor.mp3";
import BLOCK_CLEAR from ".././assets/Audio/clearBlock.mp3";
import CHAIN2 from ".././assets/Audio/Super Mario 64 Red Coin 1.mp3";
import CHAIN3 from ".././assets/Audio/Super Mario 64 Red Coin 2.mp3";
import CHAIN4 from ".././assets/Audio/Super Mario 64 Red Coin 3.mp3";
import CHAIN5 from ".././assets/Audio/Super Mario 64 Red Coin 4.mp3";
import CHAIN6 from ".././assets/Audio/Super Mario 64 Red Coin 5.mp3";
import CHAIN7 from ".././assets/Audio/Super Mario 64 Red Coin 6.mp3";
import CHAIN8 from ".././assets/Audio/Super Mario 64 Red Coin 7.mp3";
import CHAIN9 from ".././assets/Audio/Super Mario 64 Red Coin 8.mp3";
import PAUSE from ".././assets/Audio/pause.mp3";
import SWAP_SUCCESS from ".././assets/Audio/SwapSuccess.mp3";
import SWAP_FAILED from ".././assets/Audio/SwapFailed.mp3";
import SMART_MATCH from ".././assets/Audio/smartMatch.mp3";
import FANFARE1 from ".././assets/Audio/fanfare1.mp3";
import FANFARE2 from ".././assets/Audio/fanfare2.mp3";
import FANFARE3 from ".././assets/Audio/fanfare3.mp3";
import FANFARE4 from ".././assets/Audio/fanfare4.mp3";
import FANFARE5 from ".././assets/Audio/fanfare5.mp3";
import TOPOUT from ".././assets/Audio/topout.mp3";

// Images
const sprite = {
  defaultCursor: CURSOR,
  defaultCursorOrange: CURSOR_ORANGE,
  defaultCursorPink: CURSOR_PINK,
  defaultCursorDarkGrey: CURSOR_DARK_GREY,
  defaultCursorLightGrey: CURSOR_LIGHT_GREY,
  legalCursorDown: LEGAL_SELECTION_CURSOR,
  illegalCursorDown: ILLEGAL_SELECTION_CURSOR,
  legalCursorUp: SELECTABLE_CURSOR,
  illegalCursorUp: UNSELECTABLE_CURSOR,
  movingCursor: MOVING_CURSOR,
  grid_line: GRID_LINE,
  grid_line_red: GRID_LINE_RED,
  gridLineWarnTop: GRID_WARNING_TOP,
  gridLineWarnMid: GRID_WARNING_MID,
  gridLineWarnBot: GRID_WARNING_BOT,
  rowLightLeft: ROW_LIGHT_LEFT,
  rowLightMid: ROW_LIGHT_MID,
  rowLightRight: ROW_LIGHT_RIGHT,
  light_up: LIGHT,
  light_pink: PINK_LIGHT,
  light_orange: ORANGE_LIGHT,
  blue_normal: NORMAL_B,
  blue_face: FACE_B,
  blue_dark: DARK_B,
  blue_dead: DEAD_B,
  blue_popped: POPPED_B,
  blue_blinking_0: BLINKING_0_B,
  blue_blinking_1: BLINKING_1_B,
  blue_landing_0: LANDING_0_B,
  blue_landing_1: LANDING_1_B,
  blue_landing_2: LANDING_2_B,
  blue_panicking_0: PANICKING_0_B,
  blue_panicking_1: PANICKING_1_B,
  blue_panicking_2: PANICKING_2_B,
  blue_panicking_3: PANICKING_3_B,

  cyan_normal: NORMAL_C,
  cyan_face: FACE_C,
  cyan_dark: DARK_C,
  cyan_dead: DEAD_C,
  cyan_popped: POPPED_C,
  cyan_blinking_0: BLINKING_0_C,
  cyan_blinking_1: BLINKING_1_C,
  cyan_landing_0: LANDING_0_C,
  cyan_landing_1: LANDING_1_C,
  cyan_landing_2: LANDING_2_C,
  cyan_panicking_0: PANICKING_0_C,
  cyan_panicking_1: PANICKING_1_C,
  cyan_panicking_2: PANICKING_2_C,
  cyan_panicking_3: PANICKING_3_C,

  green_normal: NORMAL_G,
  green_face: FACE_G,
  green_dark: DARK_G,
  green_dead: DEAD_G,
  green_popped: POPPED_G,
  green_blinking_0: BLINKING_0_G,
  green_blinking_1: BLINKING_1_G,
  green_landing_0: LANDING_0_G,
  green_landing_1: LANDING_1_G,
  green_landing_2: LANDING_2_G,
  green_panicking_0: PANICKING_0_G,
  green_panicking_1: PANICKING_1_G,
  green_panicking_2: PANICKING_2_G,
  green_panicking_3: PANICKING_3_G,

  purple_normal: NORMAL_P,
  purple_face: FACE_P,
  purple_dark: DARK_P,
  purple_dead: DEAD_P,
  purple_popped: POPPED_P,
  purple_blinking_0: BLINKING_0_P,
  purple_blinking_1: BLINKING_1_P,
  purple_landing_0: LANDING_0_P,
  purple_landing_1: LANDING_1_P,
  purple_landing_2: LANDING_2_P,
  purple_panicking_0: PANICKING_0_P,
  purple_panicking_1: PANICKING_1_P,
  purple_panicking_2: PANICKING_2_P,
  purple_panicking_3: PANICKING_3_P,

  red_normal: NORMAL_R,
  red_face: FACE_R,
  red_dark: DARK_R,
  red_dead: DEAD_R,
  red_popped: POPPED_R,
  red_blinking_0: BLINKING_0_R,
  red_blinking_1: BLINKING_1_R,
  red_landing_0: LANDING_0_R,
  red_landing_1: LANDING_1_R,
  red_landing_2: LANDING_2_R,
  red_panicking_0: PANICKING_0_R,
  red_panicking_1: PANICKING_1_R,
  red_panicking_2: PANICKING_2_R,
  red_panicking_3: PANICKING_3_R,

  yellow_normal: NORMAL_Y,
  yellow_face: FACE_Y,
  yellow_dark: DARK_Y,
  yellow_dead: DEAD_Y,
  yellow_popped: POPPED_Y,
  yellow_blinking_0: BLINKING_0_Y,
  yellow_blinking_1: BLINKING_1_Y,
  yellow_landing_0: LANDING_0_Y,
  yellow_landing_1: LANDING_1_Y,
  yellow_landing_2: LANDING_2_Y,
  yellow_panicking_0: PANICKING_0_Y,
  yellow_panicking_1: PANICKING_1_Y,
  yellow_panicking_2: PANICKING_2_Y,
  yellow_panicking_3: PANICKING_3_Y,

  unmatchable: UNMATCHABLE,
  vacant_normal: NORMAL_V,
  vacant_face: FACE_V,
  vacant_dark: DARK_V,
  vacant_dead: DEAD_V,
  vacant_swapping: SWAPPING_V,
  vacant_popped: POPPED_V,
  vacant_blinking_0: BLINKING_0_V,
  vacant_blinking_1: BLINKING_1_V,
  vacant_landing_0: LANDING_0_V,
  vacant_landing_1: LANDING_1_V,
  vacant_landing_2: LANDING_2_V,
  vacant_panicking_0: PANICKING_0_V,
  vacant_panicking_1: PANICKING_1_V,
  vacant_panicking_2: PANICKING_2_V,
  vacant_panicking_3: PANICKING_3_V,

  // arrow items
  arrowLeftStartOrange: L_ARROW_START_ORANGE,
  arrowLeftStartPink: L_ARROW_START_PINK,
  arrowLeftStartDark: L_ARROW_START_DARK,
  arrowLeftStartGrey: L_ARROW_START_GREY,
  arrowLeftStartMagenta: L_ARROW_START_MAGENTA,

  arrowLeftEndOrange: L_ARROW_END_ORANGE,
  arrowLeftEndPink: L_ARROW_END_PINK,
  arrowLeftEndDark: L_ARROW_END_DARK,
  arrowLeftEndGrey: L_ARROW_END_GREY,
  arrowLeftEndMagenta: L_ARROW_END_MAGENTA,

  arrowRightStartOrange: R_ARROW_START_ORANGE,
  arrowRightStartPink: R_ARROW_START_PINK,
  arrowRightStartDark: R_ARROW_START_DARK,
  arrowRightStartGrey: R_ARROW_START_GREY,
  arrowRightStartMagenta: R_ARROW_START_MAGENTA,

  arrowRightEndOrange: R_ARROW_END_ORANGE,
  arrowRightEndPink: R_ARROW_END_PINK,
  arrowRightEndDark: R_ARROW_END_DARK,
  arrowRightEndGrey: R_ARROW_END_GREY,
  arrowRightEndMagenta: R_ARROW_END_MAGENTA,

  arrowMidOrange: H_ARROW_MID_ORANGE,
  arrowMidPink: H_ARROW_MID_PINK,
  arrowMidDark: H_ARROW_MID_DARK,
  arrowMidGrey: H_ARROW_MID_GREY,
  arrowMidMagenta: H_ARROW_MID_MAGENTA,

  arrowDownStartOrange: D_ARROW_START_ORANGE,
  arrowDownStartPink: D_ARROW_START_PINK,
  arrowDownStartDark: D_ARROW_START_DARK,
  arrowDownStartGrey: D_ARROW_START_GREY,
  arrowDownStartMagenta: D_ARROW_START_MAGENTA,

  arrowDownMidOrange: D_ARROW_MID_ORANGE,
  arrowDownMidPink: D_ARROW_MID_PINK,
  arrowDownMidDark: D_ARROW_MID_DARK,
  arrowDownMidGrey: D_ARROW_MID_GREY,
  arrowDownMidMagenta: D_ARROW_MID_MAGENTA,

  arrowDownEndOrange: D_ARROW_END_ORANGE,
  arrowDownEndPink: D_ARROW_END_PINK,
  arrowDownEndDark: D_ARROW_END_DARK,
  arrowDownEndGrey: D_ARROW_END_GREY,
  arrowDownEndMagenta: D_ARROW_END_MAGENTA,

  arrowLeftToDownOrange: LtD_ARROW_ORANGE,
  arrowLeftToDownPink: LtD_ARROW_PINK,
  arrowLeftToDownDark: LtD_ARROW_DARK,
  arrowLeftToDownGrey: LtD_ARROW_GREY,
  arrowLeftToDownMagenta: LtD_ARROW_MAGENTA,

  arrowRightToDownOrange: RtD_ARROW_ORANGE,
  arrowRightToDownPink: RtD_ARROW_PINK,
  arrowRightToDownDark: RtD_ARROW_DARK,
  arrowRightToDownGrey: RtD_ARROW_GREY,
  arrowRightToDownMagenta: RtD_ARROW_MAGENTA,

  // debug items
  debugCursor: DEBUG_CURSOR,
  debugWhite: DEBUGW,
  debugOrange: DEBUGO,
  debugBrown: DEBUGB,
  debugPink: DEBUGP,
  debugRed: DEBUGR,
  debugMagenta: DEBUGM,
  debugBlue: DEBUGC,
  debugGreen: DEBUGG,
  debugTan: DEBUGT,
  debugViolet: DEBUGV,
  debugYellow: DEBUGY,
};

const spriteCopy = JSON.parse(JSON.stringify(sprite));

const audio = {
  // Essential audio loads before game start (16)
  select: SWAP_SUCCESS,
  selectionFailed: SWAP_FAILED,
  moveCursor: MOVE_CURSOR,
  announcer5: ANN_5,
  announcer4: ANN_4,
  announcer3: ANN_3,
  announcer2: ANN_2,
  announcer1: ANN_1,
  announcerGo: ANN_GO,
  blockClear: BLOCK_CLEAR,
  chain2: CHAIN2,
  chain3: CHAIN3,
  chain4: CHAIN4,
  chain5: CHAIN5,
  chain6: CHAIN6,
  chain7: CHAIN7,
  chain8: CHAIN8,
  chain9: CHAIN9,
  announcerReady: ANN_READY,
  announcerTrainingStage: ANN_TRAINING_STAGE,
  pause: PAUSE,
  topout: TOPOUT,
  fanfare1: FANFARE1,
  fanfare2: FANFARE2,
  fanfare3: FANFARE3,
  fanfare4: FANFARE4,
  fanfare5: FANFARE5,
  announcerNotMuchTime: ANN_NOT_MUCH_TIME,
  announcerIHopeReady: ANN_I_HOPE_READY,
  smartMatch: SMART_MATCH,
  holdIt1: HOLD_IT_1,
  announcerKO: ANN_KO,

  // non-essential audio loads afterwards.

  holdIt2: HOLD_IT_2,
  holdIt3: HOLD_IT_3,
  holdIt4: HOLD_IT_4,
  announcerBraceYourself: ANN_BRACE_YOURSELF,
  announcerWatchChampBask: ANN_WATCH_CHAMP_BASK,
  announcerDecisiveStrength: ANN_DECISIVE_STRENGTH,
  announcerMakeNoMistake: ANN_MAKE_NO_MISTAKE,
  announcerOnlyWordWorthy: ANN_ONLY_WORD_WORTHY,
  announcerAllTheGlory: ANN_ALL_THE_GLORY,
  announcerFatLadySing: ANN_FAT_LADY_SING,
  announcerLetsKeepItUp: ANN_LETS_KEEP_IT_UP,
  announcerBattleContinues: ANN_BATTLE_CONTINUES,
  announcerAintOver: ANN_AINT_OVER,
  announcerPerfect: ANN_PERFECT,
  announcerNoDoubt: ANN_NO_DOUBT,
  announcerNowsYourChance: ANN_NOWS_YOUR_CHANCE,
  announcerPickUpPace: ANN_PICK_UP_PACE,
  announcerAreYouReady: ANN_ARE_YOU_READY,
  announcerLetsGetStarted: ANN_LETS_GET_STARTED,
  announcerTraining: ANN_TRAINING,
  announcerPayoff: ANN_PAYOFF,
  announcerBeautiful: ANN_BEAUTIFUL,
  announcerBringUsHome: ANN_BRING_US_HOME,
  announcerClear: ANN_CLEAR,
  announcerFantasticCombo: ANN_FANTASTIC_COMBO,
  announcerHowMuchLonger: ANN_HOW_MUCH_LONGER,
  announcerSomethingBig: ANN_SOMETHING_BIG,
  announcerCallThisOne: ANN_CALL_THIS_ONE,
  announcerComboIntense: ANN_COMBO_INTENSE,
  announcerAnythingLike: ANN_ANYTHING_LIKE,
  announcerWhatPower: ANN_WHAT_POWER,
  announcerInvincible: ANN_INVINCIBLE,
  announcerIncredibleCantBelieve: ANN_INCRED_BELIEVE,
  announcerIncredibleTechnique: ANN_INCRED_TECHNIQUE,
  announcerIsItTheEnd: ANN_IS_THE_END,

  announcerAllBoilsDown: ANN_ALL_BOILS,
  announcerAnymoreIntenseThanThis: ANN_ANY_MORE_INTENSE,
  announcerWontBeLong: ANN_WONT_BE_LONG,
  announcerFireworks: ANN_FIREWORKS,
  announcerNoOneSeeComing: ANN_NO_ONE_SEE,
  announcerTenSeconds: ANN_TEN_SECONDS,
  announcerWorldAnticipation: ANN_WORLD_ANTICIPATION,
  announcerThereItIs: ANN_THERE_IT_IS,
  announcerCouldBeEnd: ANN_COULD_BE_END,
  announcerTurnAllAround: ANN_TURN_ALL_AROUND,
  announcerTimeMarchesOn: ANN_TIME_MARCHES_ON,
  announcerUnbelievable: ANN_UNBELIEVABLE,
  announcerNowOrNever: ANN_NOW_OR_NEVER,
  announcerNeverForgetEvent: ANN_NEVER_FORGET_EVENT,
  announcerWhatARush: ANN_WHAT_RUSH,
  announcerWhereComeFrom: ANN_WHERE_COME_FROM,
  announcerDeservePraise: ANN_DESERVE_PRAISE,
  announcerMovesLikeThat: ANN_YOU_DONT_SEE_MOVES,
  popcornMusic: POPCORN_SONG,
  trainingMusic: TRAINING_SONG,
  popcornExtendedMusic: POPCORN_SONG_EXTENDED,
  scatmanMusic: SCATMAN_SONG,
  rashidMusic: RASHID_SONG,
  lipMusic: LIP_SONG,
  ryuMusic: RYU_SONG,
  hugoMusic: HUGO_SONG,
  physicsMusic: PHYSICS_SONG,
  cub3dMusic: CUB3D_SONG,
  collapsedRegMusic: COLLAPSED_REG_SONG,
  expresswaySong: EXPRESSWAY_SONG,
  wreckingBallSong: WRECKING_BALL_SONG,
  collapsedOTMusic: COLLAPSED_OT_SONG,
  strikersMusic: STRIKERS_SONG,
  edgeworthMusic: EDGEWORTH_SONG,
  grimMusic: GRIM_SONG,
  gioMusic: GIO_SONG,
  surgeMusic: SURGE_SONG,
  results1Music: RESULTS_SONG,
  results2Music: RESULTS_2_SONG,
};

const imageKeys = Object.keys(sprite);
const imageList = Object.values(sprite);
export const audioKeys = Object.keys(audio);
export const audioList = Object.values(audio);

// Load all images
let loadedSprites = {};
for (let i = 0; i < imageKeys.length; i++) {
  let img = new Image();
  img.src = imageList[i];
  loadedSprites[imageKeys[i]] = img;
}

export { sprite, audio, loadedSprites };

/* Fun note for programmer: EXPORTING the loaded Images here
are what allow the program to preload the images for use, even
if they aren't accessed or imported by any other files.
*/
