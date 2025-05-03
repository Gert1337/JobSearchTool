import Link from 'next/link'
import React from 'react'

function Nav() {
  return (
    <div>
    <nav className="bg-white border-b px-4 py-3 shadow">
    <ul className="flex space-x-6">
        <li>
            <Link href="/" className="text-gray-700 hover:text-black">
                Home
            </Link>
        </li>
        <li>
            <Link href="/companies" className="text-gray-700 hover:text-black">
                Companies
            </Link>
        </li>
        <li>
            <Link href="/addjob" className="text-gray-700 hover:text-black">
                Add a new job
            </Link>
        </li>
    </ul>
</nav>
    </div>
  )
}

export default Nav
