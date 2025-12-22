import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-black text-white py-6 text-center">
            <p>&copy; {new Date().getFullYear()} MotoCare. All rights reserved.</p>
        </footer>
    )
}
