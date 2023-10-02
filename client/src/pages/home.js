import {BucketSize, BucketTotalObject} from "../components";
import {useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const {user: {role}} = useSelector(state => state.auth);
    return (
        <div className={'w-full h-full'}>
            <div className={'flex flex-col max-w-4xl mx-auto gap-5'}>
                {
                    role === 'user' ? <>
                        <Button onClick={()=> navigate('/upload')} className={'custom-button max-w-sm mx-auto'}>Dosya Yükle</Button>
                    </> : <>
                        <BucketSize/>
                        <BucketTotalObject/>
                    </>
                }
            </div>
        </div>
    );
}

export default Home;
