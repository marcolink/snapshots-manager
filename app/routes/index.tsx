import {useNavigate} from "remix";
import {useInBrowser} from "~/utils/useInBrowser";

const locations = [
    "app-config",
    "entry-field",
    "entry-editor",
    "entry-sidebar",
    "dialog",
    "page"
];

export default function Index() {
    let navigate = useNavigate();
    useInBrowser(() => {
        const isLocation = window.__SDK__.location.is;
        for (const location of locations) {
            if (isLocation(location)) {
                return navigate(location);
            }
        }
    })
    return null;
}
