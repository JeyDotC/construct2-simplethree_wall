function GetBehaviorSettings()
{
	return {
		"name":			"SimpleThree_Wall",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"SimpleThree_Wall",			// this is used to SimpleThree_Wall this behavior and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Applies a Name and/or a series of tags to an object and pick those object by Name or Tag.",
		"author":		"JeyDotC",
		"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
	};
};

////////////////////////////////////////
ACESDone();

var property_list = [
	new cr.Property(ept_integer, "Vertical height", 32, "The wall's vertical height in 2D pixels."),
	new cr.Property(ept_combo, "Vertical hotspot", "Bottom", "Choose the location of the vertical hot spot in the object.", "Top|Center|Bottom"),
	new cr.Property(ept_integer, "Elevation", 0, "How height is this wall elevated from ground in 2D pixels."),
	new cr.Property(ept_float, "Rotation X", 0, "Rotation on the X axis in degrees."),
	new cr.Property(ept_float, "Rotation Z", 0, "Rotation on the Z axis in degrees."),
	new cr.Property(ept_combo, "Texture repeat", "For Wall", "Make the texture repeat for wall or for roof/floor.", "For Wall|For Floor"),
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
