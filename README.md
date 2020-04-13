# SimpleThree_Wall

Applies a Name and/or a series of tags to an object and allows to pick those object by Name or Tag. This behavior is thought to resemble the HTML/CSS idea of ids and classes, where you can pick an individual element by Id, but multiple elements by one of its multiple classes.

In our case, the **Name** is sort of an *Id* you can give to an object, so, the ideal is to give each object a unique one (though, it's not mandatory). 

And the **Tags** are a series of *classes* many objects may belong to. Use this property to group objects by a certain characteristic. Any single object can have many tags and there are events for the addition or removal of tags, allowing to do lots of changes to an object as soon as a tag is added/removed, just like HTML when you add/remove a class from an element.

[Download](https://www.construct.net/co/construct-2/addons/167/SimpleThree_Wall)

# Properties

| Name | Description |
|------|-------------|
| **Name** | A name for this object. Think of it as an Id to pick an individual object. |
| **Tags** | A list of tags. Separated by the given separator. |
| **Tags separator** | The separator for this object's tags. |

# ACES

## Actions

| Name | Description | Params |
|------|-------------|--------|
| **Set Name** | Sets this instance name. | **Name:** The name this instance will have. We recomend it to be unique, though, it's not mandatory. |
| **Add Tag** | Adds a tag to this instance. | **Tag:** The tag name to add. |
| **Remove Tag** | Removes a tag from this instance. | **Tag:** The tag name to remove. |

## Conditions

| Name | Description | Params |
|------|-------------|--------|
| **Is Named** | Pick instances by their name. | **Name:** Instance name. |
| **Has Tag** | Pick all instances that contain the given tag. | **Tag:** A tag to look for. |
| **On tagged** | Triggered when the given tag is added. | **Tag:** The tag that has been added. |
| **On un-tagged** | Triggered when the given tag is removed | **Tag:** The tag that has been removed. |

## Expressions

| Name | Description | Params |
|------|-------------|--------|
| **Name** | Return the name given to this instance. | |
| **Has tag** | Returns 1 if this instance has the given tag, 0 otherwise. | **Tag:** The tag name to find. |

[Download](https://www.construct.net/co/construct-2/addons/167/SimpleThree_Wall)