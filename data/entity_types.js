/**
 * @namespace MAGPIE.KEY.ENTITY.TYPE
 * @description centralized lookup table for entity types
 * @author Matheraptor
 * @license GNUGPLv3
 * 
 * @version 0.19.1
 * 
 * @changelog 20260419 {@link MAGPIE.meta.version}
 * 
 * @typedef {import("../core/system").day} day
 * @typedef {import("../core/entity").entityID} entityID 
 * @typedef {import("../core").orbit_data} orbit_data
 * @typedef {import("../core/physics").POVART} POVART
 * @typedef {Number} expID
 * @typedef {Number} stateID
 * @typedef {Number} traitID
 * 
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * birth: day,
 * parents: entityID[],
 * children: entityID[],
 * orbit: orbit_data,
 * POVART: POVART,
 * STATS: {},
 * traits: traitID[],
 * states: stateID[],
 * exps: expID[],
 * sensors: entityID[],
 * emitters: entityID[],
 * host: entityID,
 * inventory: entityID[],
 * equip: entityID[],
 * deck: traitID[],
 * vault: expID[]
 * }} entity_type_data
 * @type {Map<String, entity_type_data>}
 */
const ENTITY_TYPES = new Map();
const ENTITY_GENERIC = {
    name: "ENTITY_GENERIC",
    type: 1,
    birth: 0,
    parents: [],
    children: [],
    orbit: {},
    POVART: [],
    STATS: {},
    traits: [],
    states: [],
    exps: [],
    sensors: [],
    emitters: [],
    host: 0,
    inventory: [],
    equip: [],
    deck: [],
    vault: []
};
ENTITY_TYPES.set("ENTITY_GENERIC", ENTITY_GENERIC);
const MARKER = Object.create(ENTITY_GENERIC);
MARKER.type = ENTITY_GENERIC.type + 1;
ENTITY_TYPES.set("MARKER", MARKER);
const ASTROMARKER = Object.create(MARKER);
ASTROMARKER.type = MARKER.type + 1;
ENTITY_TYPES.set("ASTROMARKER", ASTROMARKER);
const GEOMARKER = Object.create(MARKER);
GEOMARKER.type = ASTROMARKER.type + 1;
ENTITY_TYPES.set("GEOMARKER", GEOMARKER);
const TILE_MARKER = Object.create(MARKER);;
TILE_MARKER.type = GEOMARKER.type + 1;
ENTITY_TYPES.set("TILE_MARKER", TILE_MARKER);
const CONTACT = Object.create(MARKER);;
CONTACT.type = 20;
ENTITY_TYPES.set("CONTACT", CONTACT);
const BEARING = Object.create(MARKER);;
BEARING.type = CONTACT.type + 1;
ENTITY_TYPES.set("BEARING", BEARING);
const META = Object.create(MARKER);;
META.type = BEARING.type + 1;
ENTITY_TYPES.set("META", META);
const LORE = Object.create(MARKER);;
LORE.type = META.type + 1;
ENTITY_TYPES.set("LORE", LORE);
const CELESTIAL = Object.create(ENTITY_GENERIC);
CELESTIAL.type = 200;
ENTITY_TYPES.set("CELESTIAL", CELESTIAL);
const STAR = Object.create(CELESTIAL);
STAR.type = CELESTIAL.type + 1;
ENTITY_TYPES.set("STAR", STAR);
const PLANET = Object.create(CELESTIAL);
PLANET.type = STAR.type + 1;
ENTITY_TYPES.set("PLANET", PLANET);
const MOON = Object.create(CELESTIAL);
MOON.type = PLANET.type + 1;
ENTITY_TYPES.set("MOON", MOON);
const ASTEROID = Object.create(CELESTIAL);
ASTEROID.type = MOON.type + 1;
ENTITY_TYPES.set("ASTEROID", ASTEROID);
const PLANET_GENERIC = Object.create(PLANET);
PLANET_GENERIC.type = 220;
ENTITY_TYPES.set("PLANET_GENERIC", PLANET_GENERIC);
const PLANET_TERRESTRIAL = Object.create(PLANET_GENERIC);
PLANET_TERRESTRIAL.type = PLANET_GENERIC.type + 1;
ENTITY_TYPES.set("PLANET_TERRESTRIAL", PLANET_TERRESTRIAL);
//
const MATERIA = Object.create(ENTITY_GENERIC);
MATERIA.type = 400;
ENTITY_TYPES.set("MATERIA", MATERIA);
//
module.exports = ENTITY_TYPES;