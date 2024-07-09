export default function Action ( props )
{
    function clicked()
    {
        console.log(props.action)
    }

    return (
        <div onClick={clicked}>
            {props.action.displayName}
        </div>
    );
}