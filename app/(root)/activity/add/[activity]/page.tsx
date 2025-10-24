
import React from 'react'
import Header from '@/components/shared/Header'
import { redirect, useParams } from 'next/navigation'
import { activityTypes } from '@/constants'
import ActivityForm from '@/components/shared/ActivityForm'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/users.actions'


const AddActivityPage = async ({params} : {params: Promise<{activity:string}>}) => {
const clerk_user = await currentUser()
const {activity} = await params
const Activity = activityTypes[activity]

if(!clerk_user) redirect('/sign-in')

const user = await getUserById(clerk_user.id)



  return (
    <>
        <Header
    title={Activity.title}
    subTitle={Activity.subTitle}
    ></Header>
    <section className='mt-10'>
          <ActivityForm 
    action="Add" 
    userId={user._id} 
    type={Activity.type as ActivityTypeKey}
    creditBalance={user.creditBalance}
    />
    </section>

    </>
  )
}

export default AddActivityPage
