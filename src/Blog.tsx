import React from 'react';
import { Link } from 'react-router-dom';

import './Menu.css'

interface Props {
    title: string;
}

const Blog = (props: Props) => {

    return <h1>{props.title}</h1>;

}

export default Blog;
