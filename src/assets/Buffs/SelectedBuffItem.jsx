import { useEffect, useState } from "react";

export default function SelectedBuffItem ( props )
{
    const [buff, setBuff] = useState({});
    const [buffJSON, setBuffJSON] = useState({});
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        setBuff(props.buff);
    }, [props.buff])

    function cancel (event)
    {
        props.removeBuff( props.index );
    }

    function lockLevel ( event )
    {
        setLocked(!locked);

        props.update(buffJSON);
    }

    // If the buff is beïng set, disable the level field and propagate the buffJSON up
    useEffect(() => {

        document.getElementById(buff.buffID + "levelInput" + props.index).disabled = locked;

        
    }, [locked])

    function generateJSON( event )
    {
        let tempJSON = {};
        let idJSON = {};

        idJSON.buffID = buff.buffID;
        idJSON.level = event.target.value;

        tempJSON.id = idJSON;
        tempJSON.buff = buff;

        setBuffJSON(tempJSON);
    }

    return (
        <tr key={buff.buffID + "row" + props.index}>
            <td key={buff.buffID + "name"}>
                {buff.buffName}
            </td>
            <td key={buff.buffID + "level" + props.index} >
                <input type="text" key={buff.buffID + "levelInput" + props.index} id={buff.buffID + "levelInput" + props.index} size={2} onChange={generateJSON}/>
            </td>
            <td key={buff.buffID + "set"}>
                <button type="button" key={buff.buffID + "setButton" + props.index} id={buff.buffID + "setButton"} onClick={lockLevel}>Set</button>
            </td>
            <td key={buff.buffID + "cancel" + props.index} className="cancel" onClick={cancel}>
                X
            </td>
        </tr>
    );
}