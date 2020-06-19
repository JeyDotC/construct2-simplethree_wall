/*
Copyright 2020 Jeysson Guevara (JeyDotC)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function GetBehaviorSettings()
{
	return {
		"name":			"SimpleThree Wall",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"SimpleThree_Wall",			// this is used to SimpleThree_Wall this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Converts a tiled background in a 3D box or a plane.",
		"author":		"JeyDotC",
		"help url":		"https://github.com/JeyDotC/construct2-SimpleThree_Wall",
		"category":		"Three Js",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

if (typeof module !== 'undefined') {
	module.exports = { settings: GetBehaviorSettings(), type: 'Behavior'};
}
// Actions

AddNumberParam("Vertical height", "The wall's vertical height in 2D Pixels.", 0);
AddAction(0, 0, "Set Wall Vertical Height from 2D pixels", "Transform", "Wall height to <b>{0}</b>", "Set the Wall's vertical height from 2D pixel length.", "SetVerticalHeightFrom2D");

AddNumberParam("Elevation", "The new wall's elevation in 2D Pixels.", 0);
AddAction(1, 0, "Set Wall Elevation from 2D pixels", "Transform", "Wall Elevation to <b>{0}</b>", "Set the Wall's Elevation from 2D pixel length.", "SetElevationFrom2D");

AddNumberParam("Rotation X", "The wall's X axis rotation in degrees.", 0);
AddAction(2, 0, "Set Wall X axis rotation", "Transform", "Wall X axis rotation to <b>{0}</b> degrees", "Set the Wall's X axis rotation in degrees.", "SetRotationXFrom2D");

AddNumberParam("Rotation Z", "The wall's Z axis rotation in degrees.", 0);
AddAction(3, 0, "Set Wall Z Axis Rotation", "Transform", "Wall Z axis rotation to <b>{0}</b> degrees", "Set the Wall's Z axis rotation in degrees.", "SetRotationZFrom2D");

// Conditions
AddCmpParam("Comparison", "");
AddNumberParam("Value", "Value to compare Vertical Height with", "0");
AddCondition(0, 0, "Compare Vertical Height", "Transform", "Vertical Height is {0} to <i>{1}</i>", "Compare the Wall's current Vertical Height.", "CompareVerticalHeight" );

AddCmpParam("Comparison", "");
AddNumberParam("Value", "Value to compare Elevation with", "0");
AddCondition(1, 0, "Compare Elevation", "Transform", "Elevation is {0} to <i>{1}</i>", "Compare the Wall's current Elevation.", "CompareElevation" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation X with in degrees", "0");
AddCondition(2, 0, "Compare Rotation X", "Transform", "Rotation X is {0} to <i>{1}</i>", "Compare the Wall's current Rotation X.", "CompareRotationX" );

AddCmpParam("Comparison", "");
AddNumberParam("Angle (degrees)", "Angle to compare Rotation Z with in degrees", "0");
AddCondition(3, 0, "Compare Rotation Z", "Transform", "Rotation Z is {0} to <i>{1}</i>", "Compare the Wall's current Rotation Z.", "CompareRotationZ" );

// Expressions
AddExpression(0, ef_return_number, "Vertical Height", "Transform", "VerticalHeight", "The Wall Vertical Height in Pixels.");
AddExpression(1, ef_return_number, "Elevation", "Transform", "Elevation", "The Wall Elevation in Pixels.");
AddExpression(2, ef_return_number, "Rotation X", "Transform", "RotationX", "The Wall Rotation X in Degrees.");
AddExpression(3, ef_return_number, "Rotation Z", "Transform", "RotationZ", "The Wall Rotation Z in Degrees.");

////////////////////////////////////////
ACESDone();

var property_list = [
	new cr.Property(ept_integer, "Vertical height", 32, "The wall's vertical height in 2D pixels."),
	new cr.Property(ept_combo, "Vertical hotspot", "Bottom", "Choose the location of the vertical hot spot in the object.", "Top|Center|Bottom"),
	new cr.Property(ept_integer, "Elevation", 0, "How height is this wall elevated from ground in 2D pixels."),
	new cr.Property(ept_float, "Rotation X", 0, "Rotation on the X axis in degrees."),
	new cr.Property(ept_float, "Rotation Z", 0, "Rotation on the Z axis in degrees."),
	new cr.Property(ept_combo, "Type", "Box", "The type of this wall: Box, Vertical Plane (Width is ignored on creation), Horizontal Plane (Vertical Height is ignored on creation)", "Box|Vertical Plane|Horizontal Plane"),
];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
};

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};
