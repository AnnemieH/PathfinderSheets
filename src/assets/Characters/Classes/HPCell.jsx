import { useEffect } from "react";
import { getModifier } from "../../Attributes/getModifier";
import findCharAttributeByID from "../Functions/attributes";

// PROPS
// charClass - the class we're working on
// character - the current character
// level - the current working level separate from charClass
// editing - whether or not we're editing HPCell
// update - a function to propagate changes in HP upwards

export default function HPCell ( props )
{
    // Whenever we start editing, set the value of hpInput to be the current HP
    useEffect( () => {
        if( props.editing === true )
        {
            document.getElementById(props.charClass.id.classid + "hpInput").value = props.charClass.hp;
        }
    }, [props.editing])

    function hpValidation ( hp )
    {
        // Create a regex for validation
        const validationRegex = /^[0-9]+$/

        // Check if input is a number, if it's not, return false
        if ( !validationRegex.test(hp) || hp.length == 0 )
        {
            return false;
        }
        else 
        {
            // Now that we've verified we're dealing with a number, parse it as one and check that we're in allowed ranges
            const input = parseInt(hp);

            // If it's not in the allowed range, return false
            if ( input < props.level || input > (props.level * (props.charClass.charClass.hitDie)))
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

    function hpChanged ( event )
    {
        event.preventDefault();

        if ( hpValidation ( event.target.value ) )
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
                                <input type="text" size={4} id={props.charClass.id.classid + "hpInput"} onChange={hpChanged}/>
                            </td>
                            <td>
                                + {(getModifier(findCharAttributeByID(props.character, 3)) * props.charClass.level)}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                (<label htmlFor={props.charClass.id.classid + "hpInput"}>{props.level} - {(props.level * (props.charClass.charClass.hitDie))}</label>)
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
                    {parseInt(props.charClass.hp) + parseInt(getModifier(findCharAttributeByID(props.character, 3)) * props.charClass.level)}
                </span>
            );
        }
}