---
name: Design Brainstorm
description: A brainstorming session for the design of the MAGPIE Server.
author: Matheraptor
version: 0.20.0 2026-04-30
status: draft
---

# Design Brainstorm

[*overview*]

[TOC]

## Runtime loop

```mermaid
stateDiagram
    [*] --> runtime : start
    runtime --> [*] : stop
    runtime --> refresh : tick
    refresh --> runtime : loop
    refresh --> hive
    hive --> hive_layer : tick
    hive_layer --> hive : loop
    hive_layer --> entity_refresh : forEach
    entity_refresh --> hive_layer : return true
    entity_refresh --> kick : return false
    kick --> hive_layer : entity is kicked
```

[Back to top ⤴️](#design-brainstorm)

---

## Hive loop

```mermaid
stateDiagram
    [*] --> hive : awake
    hive --> layer
    layer --> refreshGuest : tick
    refreshGuest --> entity : async
    entity --> refreshGuest : return true
    entity --> kick : return false
    refreshGuest --> layer : loop
    hive --> [*] : pause
    hive --> host
    host --> entity

```

### Dependency flow

```mermaid
gitGraph
    commit id: "index" type: HIGHLIGHT tag: "enums"
    commit id: "system"
    branch repl
    checkout main
    branch hive
    commit id: "hive"
    commit id: "layer"
    checkout main
    commit id: "physics"
    commit id: "database"
    commit id: "entity"
    commit id: "server"
    checkout repl
    commit id: "r.context.RUNTIME"
    commit id: "r.context.HIVE"
    merge hive
    commit id: "refreshGuest"
    checkout main
    merge repl
```

[Back to top ⤴️](#design-brainstorm)

---

## Entity refresh loop

```mermaid
stateDiagram
    [*] --> entity : layer.forEach(entity)
    entity --> [*] : return true
    entity --> kick : return false
    kick --> [*] : entity is kicked
```

[Back to top ⤴️](#design-brainstorm)

---

## Integration loop

```mermaid
graph TD
    %% CLIENT LAYER
    subgraph "RMMZ+CGC Client"
        P_INPUT[Player Selects Card] -- **(-1) STA** ends turn --> DUMMY[Dummy Enemy Resolution]
        DUMMY -- Card is in 'Charging' zone --> SOCKET_OUT[Socket: Send Payload]
        SOCKET_OUT--> PLAYBACK_HOOK[Playback hook]
        PLAYBACK_HOOK -- player reacts--> P_INPUT
        PLAYBACK_HOOK -- player waits --> SOCKET_IN
        SOCKET_IN -- "translates schema" --> SAFE_HOOK[Actor Turn Start: Safe Hook]
        SAFE_HOOK -- "Overrides Board State" --> UI_RESET[UI: Sync Hand/Discard]
        UI_RESET --> P_INPUT
    end

    %% NETWORK LAYER
    subgraph "Server: Network Perimeter"
        SOCKET_OUT -- "Validates Schema" --> INGESTION[Ingestion Handler]
        INGESTION -- "Creates Stimulus Ticket" --> EXPS[(entity.exps Queue)]
        
        SERVER_OUT[Socket: Broadcast Truth] --> SOCKET_IN[Socket: Receive Payload]
    end

    %% CORE ECS LAYER
    subgraph "Server: core ECS/OOP"
        P_EXP[1. processExp / Execution]
        EXPS --> P_EXP
        P_EXP -- "If Stimulus: Generates Reaction" --> EXPS
        P_EXP -- "If Reaction: Executes Logic" --> LOGIC((Trait Logic))
        LOGIC -- "Commits Physical Result" --> SERVER_OUT

        P_EXP --> P_STATES[2. processStates / Metabolism]
        P_STATES -- "Updates Resources" --> HAND[[entity._hand]]
        
        P_STATES --> AGENCY[3. .agency / Consciousness]
        EXPS -. "Observes Reaction" .-> AGENCY
        HAND -. "Observes Hand" .-> AGENCY
        AGENCY -- "Autonomy (Approve/Veto/Override)" --> EXPS
        AGENCY -- "Commits Hand State" --> SERVER_OUT
    end
    
    %% STAMINA NOTE
    note1[Stamina = Cards in Hand] -.- HAND
    style note1 fill:#f9f,stroke:#333,stroke-width:1px
```

[Back to top ⤴️](#design-brainstorm)

---
