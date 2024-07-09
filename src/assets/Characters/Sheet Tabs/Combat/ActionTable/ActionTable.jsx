
// PROPS

import ActionColumn from "./ActionColumn";

// character - the current character
export default function ActionTable( props )
{
    function actionFilter ( actionLength )
    {
        return props.character.derived.abilities.filter( ability => ability.action == actionLength );
    }

    if ( props.character.derived !== undefined )
    {
        return ( 
            <table>
                <thead>
                    <tr>
                        <td colSpan={8}>
                            <h2>Actions</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Long
                        </td>
                        <td>
                            Full-round
                        </td>
                        <td>
                            Standard
                        </td>
                        <td>
                            Move
                        </td>
                        <td>
                            Swift
                        </td>
                        <td>
                            Free
                        </td>
                        <td>
                            Immediate
                        </td>
                        <td>
                            Misc
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <ActionColumn actions={actionFilter("long")}/>
                        <ActionColumn actions={actionFilter("full-round")}/>
                        <ActionColumn actions={actionFilter("standard")}/>
                        <ActionColumn actions={actionFilter("move")}/>
                        <ActionColumn actions={actionFilter("swift")}/>
                        <ActionColumn actions={actionFilter("free")}/>
                        <ActionColumn actions={actionFilter("immediate")}/>
                        <ActionColumn actions={actionFilter("misc")}/>
                    </tr>
                </tbody>
            </table>
        )
    }
    else
    {
        return ( <></> );
    }
}