// PROPS
// expand - a function to announce we want to expand
// maxCols - the width of ExpandTableRow in <td>s
// down - a boolean to indicate direction of arrow
export default function ExpandTableRow ( props )
{
    if ( props.down )
    {
        return (
            <tr>
                <td onClick={props.expand} colSpan={props.maxCols}>
                    ▼
                </td>
            </tr>
        )
    }
    else
    {
        return (
            <tr>
                <td onClick={props.expand} colSpan={props.maxCols}>
                    ▲
                </td>
            </tr>
        )
    }
}