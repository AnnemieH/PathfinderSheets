import { useEffect } from "react";
import { maxLevel } from "../../Classes/Functions/maxLevel";


// PROPS
// charClass - the class we're working on
// character - the current character
// editing - whether or not we're editing HPCell
// update - a function to propagate changes in HP upwards

export default function LevelCell ( props )
{
    // Whenever we start editing, set the value of level to be the current HP
    useEffect( () => {
        if( props.editing === true )
        {
            document.getElementById(props.charClass.id.classid + "levelInput").value = props.charClass.level;
        }
    }, [props.editing])

    function levelValidation ( level )
    {
        // Create a regex for validation
        const validationRegex = /^[0-9]+$/

        // Check if input is a number, if it's not, return false
        if ( !validationRegex.test(level) || level.length == 0 )
        {
            return false;
        }
        else 
        {
            // Now that we've verified we're dealing with a number, parse it as one and check that we're in allowed ranges
            const input = parseInt(level);

            // If it's not in the allowed range, return false
            if ( input < 1 || input > maxLevel(props.charClass.charClass))
            {
                return false;
            }
            // Everything's good, so return true
            else
            {
                return true;
            }
        }
        
    }

    function levelChanged ( event )
    {
        event.preventDefault();

        if ( levelValidation ( event.target.value ) )
        {
            props.update ( event.target.value );
        }
        else
        {
            // If we have an invalid value, propagate an out-of-bounds value instead
            props.update ( -1 );
        }
    }

    if ( props.editing )
        {
            return (
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" size={3} id={props.charClass.id.classid + "levelInput"} onChange={levelChanged}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                (<label htmlFor={props.charClass.id.classid + "levelInput"}>1 - { maxLevel(props.charClass.charClass) }</label>)
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
        else
        {
            return (
                <span>
                    {parseInt(props.charClass.level)}
                </span>
            );
        }
}