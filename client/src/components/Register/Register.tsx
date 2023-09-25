import React from "react";

const Register = () => {
    const handleSubmit = async () => {
        const res = await fetch("http://localhost:8000/api/v1/register", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                id: "gfdopkgfrdokp^g",
                name: "Robin",
                email: "relpre.gmail.com",
                password: "mdp123"
            })
        });

        const data = await res.json();
        console.log(data);
    };

    return (
        <div>
            <p>Register</p>
            <button onClick={() => handleSubmit()}>REGISTER</button>
        </div>
    );
};

export default Register;
