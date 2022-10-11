import  { Helmet } from 'react-helmet-async';

const defaultMeta = {
  title: 'Sustainations DAO',
  description: 'The first sustainability-themed DAO on the Internet Computer'
}

const MetaTags = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title || defaultMeta.title}</title>
      <meta
        name="description"
        content={description || defaultMeta.description} />
      <meta name="keywords" content="Triip,Triip.me,Sustainations,DAO,IC,ICP,Blockchain,Metaverse" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  )
}

export default MetaTags;