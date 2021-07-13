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
| | | **Advanced**| |
|**Anisotropy**| _combo_ | The number of samples taken along the axis through the pixel that has the highest density of texels. Max will use renderer.getMaxAnisotropy method. The behavior will make sure the value is at most the maximum supported. Default value: `1` | - 1<br/>- 2<br/>- 4<br/>- 8<br/>- 16<br/>- Max |
|**Enable 2D Render**| _combo_ | If whether or not this object's 2D render will happen, disabling it saves a lot of processing power. Default value: `Disabled` | - Disabled<br/>- Enabled |
|**Magnification Filter**| _combo_ | How the texture is sampled when a texel covers more than one pixel. Default value: `Linear` | - Linear<br/>- Nearest |
|**Minification Filter**| _combo_ | How the texture is sampled when a texel covers less than one pixel. Default value: `Linear Filter` | - Nearest Filter<br/>- Nearest Mipmap Nearest Filter<br/>- Nearest Mipmap Linear Filter<br/>- Linear Filter<br/>- Linear Mipmap Nearest Filter<br/>- Linear Mipmap Linear Filter |

# ACES

## Actions

| Name | Description | Parameters |
|------|-------------|------------|
| |**Transform**| |
|**Set Wall Vertical Height from 2D pixels**| Set the Wall's vertical height from 2D pixel length. | - **Vertical height** _number_: The wall's vertical height in 2D Pixels.  |
|**Set Wall Elevation from 2D pixels**| Set the Wall's Elevation from 2D pixel length. | - **Elevation** _number_: The new wall's elevation in 2D Pixels.  |
|**Set Wall X axis rotation**| Set the Wall's X axis rotation in degrees. | - **Rotation X** _number_: The wall's X axis rotation in degrees.  |
|**Set Wall Z Axis Rotation**| Set the Wall's Z axis rotation in degrees. | - **Rotation Z** _number_: The wall's Z axis rotation in degrees.  |
| |**Advanced**| |
|**Set Wall texture anisotropy**| Sets the Wall's texture anisotropy. | - **Anisotropy** _combo_: The new anisotropy value.  **Options**: (`1`, `2`, `4`, `8`, `16`, `Max`) |

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