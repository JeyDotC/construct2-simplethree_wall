# SimpleThree Wall
**Type:** Behavior

Converts a tiled background in a 3D box or a plane.

# Properties

| Name | Type | Description | Options |
|------|------|-------------|---------|
|**Vertical height**| _integer_ | The wall's vertical height in 2D pixels. Default value: `32` |  |
|**Vertical hotspot**| _combo_ | Choose the location of the vertical hot spot in the object. Default value: `Bottom` | - Top<br/>- Center<br/>- Bottom |
|**Elevation**| _integer_ | How height is this wall elevated from ground in 2D pixels.  |  |
|**Rotation X**| _float_ | Rotation on the X axis in degrees.  |  |
|**Rotation Z**| _float_ | Rotation on the Z axis in degrees.  |  |
|**Type**| _combo_ | The type of this wall: Box, Vertical Plane (Width is ignored on creation), Horizontal Plane (Vertical Height is ignored on creation) Default value: `Box` | - Box<br/>- Vertical Plane<br/>- Horizontal Plane |

# ACES

## Actions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Transform**| |
|**Set Wall Vertical Height from 2D pixels**| Set the Wall's vertical height from 2D pixel length. | - **Vertical height** _number_: The wall's vertical height in 2D Pixels.  |
|**Set Wall Elevation from 2D pixels**| Set the Wall's Elevation from 2D pixel length. | - **Elevation** _number_: The new wall's elevation in 2D Pixels.  |
|**Set Wall X axis rotation**| Set the Wall's X axis rotation in degrees. | - **Rotation X** _number_: The wall's X axis rotation in degrees.  |
|**Set Wall Z Axis Rotation**| Set the Wall's Z axis rotation in degrees. | - **Rotation Z** _number_: The wall's Z axis rotation in degrees.  |

## Conditions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Transform**| |
|**Compare Vertical Height**| Compare the Wall's current Vertical Height. | - **Comparison** _comparison_:  <br />- **Value** _number_ = `0`: Value to compare Vertical Height with  |
|**Compare Elevation**| Compare the Wall's current Elevation. | - **Comparison** _comparison_:  <br />- **Value** _number_ = `0`: Value to compare Elevation with  |
|**Compare Rotation X**| Compare the Wall's current Rotation X. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation X with in degrees  |
|**Compare Rotation Z**| Compare the Wall's current Rotation Z. | - **Comparison** _comparison_:  <br />- **Angle (degrees)** _number_ = `0`: Angle to compare Rotation Z with in degrees  |

## Expressions

| Name | Type | Description | Parameters |
|------|------|-------------|------------|
| | |**Transform**| |
|**Vertical Height**<br/><small>**Usage:** `MyObject.SimpleThree Wall.VerticalHeight`</small>|`number`| The Wall Vertical Height in Pixels. |  |
|**Elevation**<br/><small>**Usage:** `MyObject.SimpleThree Wall.Elevation`</small>|`number`| The Wall Elevation in Pixels. |  |
|**Rotation X**<br/><small>**Usage:** `MyObject.SimpleThree Wall.RotationX`</small>|`number`| The Wall Rotation X in Degrees. |  |
|**Rotation Z**<br/><small>**Usage:** `MyObject.SimpleThree Wall.RotationZ`</small>|`number`| The Wall Rotation Z in Degrees. |  |