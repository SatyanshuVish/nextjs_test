import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

function HomePage(props){
    
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta 
                    name='description'
                    content='Browse a huge list of highly active React meetups!'
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;

//     //fetch date from an API

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         },
//         // can't use revalidate here as the page already regenerates for every request.
//     };
// }

export async function getStaticProps(){
    //fetch data from an API
    const client = await MongoClient.connect("mongodb+srv://satyanshuhata:XWQD71qeWjStM65m@cluster0.yxdejfy.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0");
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();
    
    return {
        props: {
            //meetups:meetups,         // error serializing `.meetups[0]._id` returned from `getStaticProps` in "/".
                                     // Reason: `object` ("[object Object]") cannot be serialized as JSON. Please only return JSON serializable data types.
            meetups: meetups.map((meetup) => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })),
        },
        revalidate: 5
    }
}

export default HomePage;