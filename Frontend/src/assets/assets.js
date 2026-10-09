import { CiHome } from "react-icons/ci";
import { TbInfoHexagon } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import mealmate from "./mealmate.png"
import { PiContactlessPayment } from "react-icons/pi";
import { FaCoffee, FaHamburger, FaUtensils, FaCookie, FaLeaf , FaMugHot } from "react-icons/fa";
import { GiFrenchFries } from "react-icons/gi";
import meal from './meal.png'
import mealmatenoBg from './mealmatenoBg.png'
import mymeal from "./mymeal.avif"
// imports for the admin 
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBorderRight } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { MdRestaurantMenu } from "react-icons/md";

import { IoIosHeartEmpty } from "react-icons/io";
import { ImCheckboxChecked } from "react-icons/im";
import {
    Search,
    ShoppingBag,
    UserRound,
} from "lucide-react";

export const navigations = [
  {
    id:"cninurw83ch38y392u9r2",
    path:"/",
    name:"Home",
    icon:CiHome
  },
    {
    id:"xmimexu9ur9493u9r3c88c8",
    path:"/app/menu",
    name:"Menu",
    icon:AiOutlineProduct
  },
    {
    id:"mxiur3r94893ru9u9cnuund",
    path:"/app/about",
    name:"About",
    icon:TbInfoHexagon
  },
    {
    id:"mxncn93989yu439239u12n9s",
    path:"/app/contact",
    name:"Contact",
    icon:PiContactlessPayment
  },
]


export const adminNavigation = [
    {
        id:"kdjij93ujfii3u9i2ru938ru9",
        name:"DashBoard",
        path:"/",
        icon:LuLayoutDashboard
    },
     {
        id:"ndejoi3joqjfijfnou39ofjoq",
        name:"Menu",
        path:"/app/admin/menu-page",
        icon:MdRestaurantMenu
    },
     {
        id:"kjkaiwuoi3w9ufoihiwhfn3iuy834",
        name:"Order",
        path:"/app/admin/order-detail",
        icon:TbBorderRight
    },
     
     {
        id:"mzmxmkxksoeoie93ei8u4iri84ueruiejjt",
        name:"User Manager",
        path:"/app/admin/user-managemant",
        icon:GrUserManager
    },
    {
        id:"knkenieufniwj9384y9wu39874837",
        name:"Payment",
        path:"/app/admin/payment",
        icon:MdPayment
    },
    {
        id:"vnjjfirir098849urieioijjskieu8ue",
        name:"Profile",
        path:"/app/admin/profile",
        icon:RiAdminLine
    },
]

export const categories = [
    {
        id: "breakfast",
        name: "Breakfast",
        icon: FaCoffee,
        color: "#F5B301",
        order: 1,
        subcategories: [
            { id: "continental", name: "Continental" },
            { id: "indian-breakfast", name: "Indian" },
            { id: "smoothies", name: "Smoothies & Juices" },
            { id: "quick-bites", name: "Quick Bites" },
        ],
    },
    {
        id: "lunch",
        name: "Lunch",
        icon: FaHamburger,
        color: "#0F766E",
        order: 2,
        subcategories: [
            { id: "thali", name: "Thali" },
            { id: "rice-bowls", name: "Rice Bowls" },
            { id: "sandwiches", name: "Sandwiches" },
            { id: "salads", name: "Salads" },
        ],
    },
    {
        id: "dinner",
        name: "Dinner",
        icon: FaUtensils,
        color: "#0B4A43",
        order: 3,
        subcategories: [
            { id: "curries", name: "Curries" },
            { id: "grills", name: "Grills" },
            { id: "soups", name: "Soups" },
            { id: "pasta", name: "Pasta" },
        ],
    },
    {
        id: "desserts",
        name: "Desserts",
        icon: FaCookie,
        color: "#E4572E",
        order: 4,
        subcategories: [
            { id: "cakes", name: "Cakes" },
            { id: "ice-cream", name: "Ice Cream" },
            { id: "indian-sweets", name: "Indian Sweets" },
            { id: "pastries", name: "Pastries" },
        ],
    },
    {
        id: "snacks",
        name: "Snacks",
        icon: GiFrenchFries,
        color: "#F5B301",
        order: 5,
        subcategories: [
            { id: "chaat", name: "Chaat" },
            { id: "fries-fritters", name: "Fries & Fritters" },
            { id: "namkeen", name: "Namkeen" },
            { id: "popcorn", name: "Popcorn" },
        ],
    },
    {
        id: "drinks",
        name: "Drinks",
        icon: FaMugHot,
        color: "#0F766E",
        order: 6,
        subcategories: [
            { id: "shakes", name: "Shakes" },
            { id: "mocktails", name: "Mocktails" },
            { id: "hot-beverages", name: "Hot Beverages" },
            
        ],
    },
    {
        id: "healthy",
        name: "Healthy",
        icon: FaLeaf,
        color: "#2E7D32",
        order: 7,
        subcategories: [
            { id: "salads", name: "Salads" },
            { id: "detox", name: "Detox & Juices" },
        ],
    },
];

export const headerButton = [
    {
        id:'dwdniu92uy8ru29fhifhijo',
        path:"/app/customer/faivrate",
        name:'Faivrate',
        icon:IoIosHeartEmpty
    },
     {
        id:'kni948ifwj9w8jifw9hwiqfqg',
        path:"/app/customer/cart",
        name:'Cart',
        icon:ShoppingBag
    },
    {
        id:'zmmcnjdi9384uru399uejuu398',
        path:"/app/customer/order-history",
        name:'Order',
        icon:ImCheckboxChecked
    },
     {
        id:'nckwjij3u9qiu2fwi9fqwjijq',
        path:"/app/customer/user",
        name:'User',
        icon:UserRound
    },
]

export const getSubCategory = (category)=>{
    const res =  categories.find((item)=>item.name === category   );
    
    
    return res ? res.subcategories : []
}
export const assets = {
mealmate,
meal,
mealmatenoBg,
mymeal,
}