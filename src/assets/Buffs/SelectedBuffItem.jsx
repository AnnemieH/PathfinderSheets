import { useEffect, useState } from "react";

export default function SelectedBuffItem ( props )
{
    const [buff, setBuff] = useState({});

    useEffect(() => {
        setBuff(props.buff);
    }, [props.buff])

    function cancel (event)
    {
        props.removeBuff( props.index );
    }

    return (
        <tr key={buff.buffID + "row" + props.index}>
            <td key={buff.buffID + "name"}>
                {buff.buffName}
            </td>
            <td key={buff.buffID + "level" + props.index} >
                <input type="text" key={buff.buffID + "levelInput"} id={buff.buffID + "level"} size={2}/>
            </td>
            <td key={buff.buffID + "cancel" + props.index} className="cancel" onClick={cancel}>
                X
            </td>
        </tr>
    );
}