import { useEffect, useState } from "react";

export function ChaiMenu() {
    const [menu, setMenu] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        fetch(
            "https://api.freeapi.app/api/v1/public/randomusers"
        )
            .then((res) => res.json())
            .then((data) => setMenu(data.data.data))
            .catch((err) => setError(err.message));
    }, [])

    return (
        <div>
            <h2>Available Chai</h2>
            <ul>
                {menu.map((chai) => (
                    <li key={chai.name.first}>{chai.name.first}</li>
                ))}
            </ul>
        </div>
    );
}
