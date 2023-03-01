import React, { useEffect, useState, Fragment } from "react";
import { Link } from 'react-router-dom';
import { Post } from "./util/interface";

import './Menu.css'

interface Props {
    title: string;
    url: string;
}

const Blog = (props: Props) => {

    let [posts, setPosts] = useState<Array<string> | undefined>(undefined);

    useEffect(() => {
        let cancel = false;
        const fetchPosts = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                let response = await fetch(url, payload);
                let json = await response.json();

                if (!cancel) {
                    setPosts(json["posts"]);
                }
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchPosts(props.url);
        return () => {
            cancel = true
        };
    }, [props.url]);


    if (posts === undefined) {
        return <h1>{props.title}</h1>;
    }

    return <Fragment>

            <h1>{props.title}</h1>
            <ul>{posts.map((element, index) => {
                    return  <li key={index}>
                                <Link to={"/post/" + element}>
                                    {element.replaceAll("-", " ").replaceAll(".md", "")}
                                </Link>
                </li>} )}
           </ul>
           </Fragment>;

}

export default Blog;
