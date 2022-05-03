# land-of-zenethians-2d-rpg
A 2d top down RPG made with JavaScript


## To Do's
* Resize canvas based on screen size.
* limit fps so its not determined by screen refresh rate.
* loading screen.
* Random Dungeons with rewards (loot, gold, weapons, xp, etc).
* Make an array of movement behaviours to randomly select when creating an NPC (makes them feel more alive and random).
* Make an array of dialogue options and assign them to NPC's.
* Make an array of quest dialogue options to assign to NPC's.


## Future Ideas
* Random overworld that has dungeon entrances to random generated dungeons.
* Add a Journal that will store the players previous characters, and their journeys. Listing the character back stories and significant events that happened along the way, such as: Dungeons enterd, foes killed, total steps taken, lands visited, npcs met etc.
* Add multiplayer support.
* Add randomised Regions, Towns, Cities, Biomes.
* Add Temperature, Compass, Date?, Month?, Year?, Time?
* Add Minimap with icons on Important locations.
* Add Quest markers.


## Game Structure

### Main Game Objects: UML Diagram
```mermaid
classDiagram
      Overworld <|-- OverworldMap
      Overworld <|-- DirectionInput
      Overworld <|-- OverworldEvent
      OverworldMap <|-- GameObject
      GameObject --|> Entity
      Entity <|-- Sprite
      DirectionInput <|-- KeyPressListener
      OverworldEvent <|-- KeyboardMenu
      OverworldEvent <|-- SceneTransition
      OverworldEvent <|-- TextMessage
      Battle <|-- BattleEvent
      Battle <|-- Combatant
      Battle <|-- TurnCycle
      Battle <|-- Team
      BattleEvent <|-- SubmissionMenu
      TextMessage <|-- RevealingText
      Overworld : +Object canvas
      Overworld : +Object ctx
      Overworld : +Object directionInput
      Overworld : +Object element
      Overworld : +bool isContentLoaded
      Overworld: +init()
      Overworld: +startGameLoop()
      Overworld: +startMap()
      class OverworldMap{
          +Object cutsceneSpaces
          +Object gameObjects
          +bool isCutscenePlaying
          +Object overworld
          +Object walls
          +addWall()
          +checkForActionCutscene()
          +checkForFootstepCustscene()
          +drawLowerImage()
          +drawUpperImage()
          +isSpaceTaken()
          +mountObjects()
          +moveWall()
          +removeWall()
          +startCutscene()
      }
      class OverworldEvent{
          +Object map
          +Object event
          +stand()
          +walk()
          +textMessage()
          +changeMap()
          +battle()
          +init()
      }
      class DirectionInput{
          +Array heldDirections
          +Object map
          +init()
      }
      class GameObject{
          +int id
          +String seed
          +Object attributes
          +Array behaviouLoop
          +int behaviourLoopIndex
          +String direction
          +bool isLoaded
          +bool isMounted
          +Object sprite
          +Array talking
          +int x
          +int y
          +run()
      }
      class Entity{
          +bool isStanding
          +bool isPlayerControlled
          +Object directionUpdate
          +int movingProgressRemaining
          +startBehaviour()
          +update()
          +updatePosition()
          +updateSprite()
      }
      class Sprite{
          +int animationFrameLimit
          +int animationFrameProgress
          +Object animations
          +String currentAnimation
          +int currentAnimationFrame
          +Object gameObject
          +bool isLoaded
          +bool isShadowLoaded
          +bool useShadow
          +draw()
          +setAnimation()
          +updateAnimationProgress()
      }
      class KeyboardMenu{
          +Array options
          +Object up;
          +Object down;
          +Object prevFocus;
          +setOptions()
          +createElement()
          +end();
          +init()
      }
      class KeyPressListener{
          +bool keySafe
          +keyDownFunction()
          +keyUpFunction()
          +unbind()
      }
      class Battle{
          +Object enemy
          +Callback onComplete
          +Object combatants
          +Object activeCombatants
          +Object items
          +addCombatant()
          +addEnemy() : async
          +createElement()
          +init()
      }
      class BattleEvent{
          +Object event
          +Object battle
          +textMessage() : TextMessage Object
          +stateChange() : async
          +submissionMenu() : SubmissionMenu Object
          +giveXP()
          +animation()
          +init()
      }
      class Combatant{
          +Object battle : Battle Object
          +get hpPercent()
          +get xpPercent()
          +get isActive()
          +get givesXP()
          +createElement()
          +update()
          +getReplacedEvents()
          +getPostEvents()
          +decrementStatus()
          +init()
      }
      class SubmissionMenu{
          +Object caster
          +Object enemy
          +Object replacements
          +Callback onComplete
          +Object quantityMap
          +Object items
          +getPaged()
          +menuSubmit()
          +decide()
          +showMenu()
          +init()
      }
      class TurnCycle{
        +Object battle
        +Callback onNewEvent
        +String currentTeam
        +turn() : async
        +getWinningTeam()
        +init() : async
      }
      class Team{
        +Object team
        +Object name
        +Object combatants
        +createElement()
        +update()
        +init()
      }
      class RevealingText{
        +Object element
        +String text
        +int speed
        +int timeout
        +bool isDone
        +revealOneCharacter()
        +warpToDone()
        +init()
      }
      class SceneTransition{
        +Object element
        +createElement()
        +fadeOut()
        +init()
      }
```