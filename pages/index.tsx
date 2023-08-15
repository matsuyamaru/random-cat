import {NextPage, GetServerSideProps} from "next";
import {useState} from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
  };

const IndexPage:NextPage<Props> = ({initialImageUrl}) =>{
    //1. useStateを使って状態を定義する。
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);

    //useEffect(()=> {
    //    fetchImage().then((newImage)=> {
    //        setImageUrl(newImage.url)//画像URLの状態を更新する
    //        setLoading(false);//ローディング状態を更新する
    //    })
    //},[]);
    
    const handleClick = async() => {
        setLoading(true);//読み込み中に更新する
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    }
    
    //3. ローディング中でなければ、画像を表示する
    return (
        <div className={styles.page}>
            <button className={styles.button} onClick={handleClick}>
                One more cat!
            </button>
            <div className={styles.frame}>
                {loading || <img className={styles.img} src={imageUrl}/>}
            </div>
        </div>
    )
};
export default IndexPage;

export const getServerSideProps: GetServerSideProps<Props> = async() => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl:image.url,
        },
    };
};

interface Image {
    url: string,
}

const fetchImage = async(): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};
