const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

const BRANDS = {
  1: {
    name: "MiiR",
    description: `MiiR is a premium drinkware and coffee gear brand that designs minimalist, durable products for people who value sustainability, functionality, and good design. Its core range includes stainless-steel bottles, tumblers, travel mugs, and coffee accessories that blend everyday utility with a refined, modern aesthetic. MiiR's customers are design-conscious, eco-aware individuals and brands—often outdoor enthusiasts, coffee lovers, and professionals who prefer high-quality, reusable alternatives to disposable products. The brand's standout feature is the seamless fusion of form and function: sleek, insulated drinkware built to maintain temperature, resist wear, and fit effortlessly into modern lifestyles. Each product carries a "Give Code," allowing customers to see which social or environmental project their purchase supports, creating a sense of shared purpose and transparency. For email campaigns, messaging that highlights thoughtful design, long-lasting performance, and how MiiR fits into an active, conscious lifestyle will resonate most—especially when paired with stories of how each purchase contributes to a broader impact`,
    forms_data: `form_id,form_name,form_status,created_at,updated_at,closed_form,viewed_form,viewed_form_uniques,submits,submit_rate
SdXAFr,Email Subscribe Signup form - Web,live,2025-09-22T19:55:04+00:00,2025-09-22T19:55:04+00:00,0.0,5.0,2.0,0.0,0.0
W84UV7,RIQ: MIIR: Signup-New-(mobile/SMS),live,2025-07-28T12:42:30+00:00,2025-07-28T12:42:30+00:00,68756.0,84753.0,67014.0,3161.0,0.0373
UrTNaJ,RIQ: MIIR: Signup-New-(Desktop),live,2025-07-28T11:31:09+00:00,2025-07-28T11:31:09+00:00,28053.0,69554.0,50760.0,1110.0,0.01596
RsPaK5,DTC:  SMS opt in for email subscribers,live,2025-05-20T17:25:45+00:00,2025-05-20T17:25:45+00:00,5315.0,7064.0,5485.0,581.0,0.08225
`,
    campaign_data: `Campaign Message ID,Campaign Message Name,Send Date,Send Time,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Clicks,Unique Clicks,Total Unsubscribes,Unique Unsubscribes,Spam Complaints,Bounces,Subject,Preview Text,Day of Week,Campaign Message Channel
01K8NK6AZASC196G0VRHKYMDWF,October 29th: Holiday Reminder,2025-10-29,10:30 AM,0.53213,0.00562,0.00238,0.00529,5e-05,87159,70006,965,740,313,313,7,699,Final 48 hours!,Your free gift awaits 🎁,Wednesday,Email
01K8B8X6V5YZ08RWC7PF6Y7DRD,October 25th: Lauren Barnes Collaboration,2025-10-25,06:00 PM,0.56356,0.01066,0.00297,0.00879,7e-05,99065,73887,1894,1397,389,389,9,1163,Celebrating our Lauren Barnes partnership 🏈,Cheering for her next adventure after retirement!,Saturday,Email
01K85WTD8QDQPAGFE137FNMQ15,October 22nd: Hand Grinder Highlight,2025-10-22,06:00 PM,0.63464,0.00568,0.00283,0.0017,0.0001,98948,72269,794,647,322,322,11,194,The gift every coffee lover wants ☕🎁,Meet our Hand Grinder and save $15.,Wednesday,Email
01K77K3VWQKVN0PEH4QBZTXEGM,October 14th: Pourigami Highlight,2025-10-14,06:00 PM,0.60828,0.00679,0.00368,0.00167,8e-05,106842,75797,1013,846,458,458,10,209,"Coffee, reimagined - meet new Pourigami","The most compact, elevated way to brew.",Tuesday,Email
01K74X9FW93XHBNZN06YFJ58K1,October 10th: Holiday 2025  October Promotion,2025-10-11,10:00 AM,0.64637,0.0081,0.00324,0.005,8e-05,118822,84709,1891,1062,425,425,11,658,Reminder: free 🎁 with your purchase this month,Shop now before they’re gone.,Saturday,Email
01K71XE5K0QB65RTE334BNDCB3,October 8th: Fall Colors,2025-10-08,12:00 PM,0.62835,0.00478,0.00344,0.00679,8e-05,116728,82704,847,629,453,453,10,900,Sip Into Fall 🍁,"New colors, same MiiR vibe.",Wednesday,Email
01K6D4GK0MF9185V6TM6W0A9Q1,October 1st: Holiday 2025 October Promotion,2025-10-01,06:00 PM,0.62038,0.00691,0.00412,0.0054,0.0001,120611,83026,1095,925,551,551,14,726,"{{ person.first_name|title|default:'MiiR Crew' }}, your holiday 🎁 gift is waiting",Free MiiR in October!,Wednesday,Email
01K663A96J61ZFVJJTJSWJDCBB,September 29th: Salmon Sisters X Kaladi Brothers,2025-09-30,06:00 PM,0.66496,0.02259,0.004,0.01579,6e-05,127087,87358,4455,2968,525,525,8,2108,A taste of Alaska: MiiR X Salmon Sisters & Kaladi Brothers 🌊,,Tuesday,Email
01K60738QQKCHYJN2PBVA7RZFE,September 25th: 360 Lid Highlight,2025-09-25,11:00 AM,0.56053,0.0078,0.00333,0.00855,0.00013,105430,71398,1204,993,424,424,16,1099,One Lid. Four Ways to Drink.,Upgrade your ritual with the all-new 360 Lid.,Thursday,Email
01K5KVCRFKQZYEJD66JT0CT6K7,September 23rd: Airlock Coffee Canister Highlight,2025-09-23,10:00 AM,0.54956,0.00443,0.00316,0.00399,0.0001,107187,73578,766,593,423,423,14,536,"Keep Your Coffee Fresh, The Smart Way 🥤",Our newest innovation keeps your coffee fresher for longer.,Tuesday,Email
01K5H7REW4W637RWX5447JYQN1,September 20th: Hand Grinder,2025-09-20,10:00 AM,0.55064,0.00994,0.00349,0.00448,7e-05,109570,74098,4092,1338,470,470,10,606,Meet the Hand Grinder!,"Engineered for consistency, crafted for coffee lovers.",Saturday,Email
01K5C8QPDW374JST7BTVS3SWR1,September 17th: Coffee Product Innovation (clone),2025-09-17,10:00 AM,0.6121,0.01324,0.00439,0.02591,0.0001,123064,83046,2753,1796,595,595,13,3609,"Hey {{ first_name|default:'there' }}, Your feedback just became better gear!","Newly designed Pourigami, 360 Traveler, and more.",Wednesday,Email
01K4QNJZDS1FRPYM55MCHN4NK1,September 13th: Winback Campaign 2,2025-09-13,09:00 AM,0.06819,0.00727,0.00201,0.00375,0.0,343,272,34,29,9,8,0,15,"Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁",,Saturday,Email
01K4Q1E74V6WYEVRA1GN0NQ2YR,September 10th: Winback Campaign,2025-09-10,10:00 AM,0.0666,0.00832,0.00442,0.00337,0.00052,318,256,39,32,17,17,2,13,"Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁",,Wednesday,Email
01K47KYSE91ZBX3GZX7QW0YVJ1,September 3rd: Labor Day Reminder,2025-09-03,06:00 PM,0.5505,0.00669,0.00578,0.01556,0.00015,109991,74522,1117,906,793,782,20,2140,"Hey {{ first_name|default:'there' }}, Don’t Miss Free Shipping!","Enjoy durable, thoughtfully designed MiiR gear shipped free.",Wednesday,Email
01K3RHYT81R2V2YYQCHM616BEC,August 31st: Labor Day Sale,2025-08-31,10:00 AM,0.60244,0.0058,0.00661,0.00254,0.00012,119883,82539,1083,795,918,905,16,349,Labor Day Win 🎉,Free Shipping + New Arrivals,Sunday,Email
01K3R2BZ6KR79ZRXNV1C4SCG3W,August 29th: Cascara Launch,2025-08-29,12:00 PM,0.57159,0.00634,0.00588,0.01026,0.00017,115178,78636,1049,872,820,809,24,1426,Cascara Red is Here Again! 🌟,Our classic colorway on 12oz & 20oz favorites.,Friday,Email
01K3GEPXSG0CKRSRT4WP0S09B1,August 26th: International Dog Days,2025-08-26,06:00 PM,0.55994,0.00403,0.00644,0.01158,0.00022,112363,76923,670,554,899,885,30,1609,Celebrate your pooch today!,Free engraving on our dog bowls.,Tuesday,Email
01K398EE7GTNEQDZ0X8P412RGY,August 24th: Eco-Stylist Silver Status,2025-08-24,10:00 AM,0.61727,0.00362,0.00845,0.0115,0.00019,124392,86301,697,506,1199,1182,27,1627,MiiR x Eco Stylist: Raising the Standard.,A milestone in sustainable design worth celebrating.,Sunday,Email
01K31CW60Q90VT4E5WMRCS000C,August 20th: Brand Ambassador Campaign,2025-08-20,07:00 PM,0.65562,0.01248,0.00919,0.0156,0.00025,142389,95695,2233,1821,1367,1341,36,2313,You're Invited!,Apply to be a MiiR Ambassador 🌍,Wednesday,Email
01K2HCG68SJSQX4WK7CXY4JD7C,August 14th: LTO Party Collection,2025-08-14,06:00 PM,0.56646,0.01296,0.01003,0.04103,0.00019,123051,84452,2318,1932,1524,1496,28,6379,Your invitation to celebrate. Every. Single. Day.,Introducing two new colorways that inspire celebration.,Thursday,Email
01K22QGMPK9YRP4AZQPDHTYG9N,Aug 8: Product Spotlight: 360 Traveler,2025-08-08,06:00 PM,0.55963,0.00815,0.0093,0.00095,0.00011,60592,41041,750,598,692,682,8,70,360 Traveler: Sip From Every Side,"Hot beverages, cold drinks, 360° sipping.",Friday,Email
01K1GCAEGYMCFC1R749AF4A9GT,Aug 3: Back to school PROMO,2025-08-03,06:00 PM,0.53663,0.00549,0.00786,0.00637,0.00015,69439,47736,636,488,699,699,13,570,Free etching on your favorite MiiR!,Make your gear stand out with a personal touch.,Sunday,Email
01K1B3WH3PBA7KER037FCVJMS3,July 30: MIIR Favorites,2025-07-30,06:00 PM,0.56681,0.00486,0.00797,0.00109,0.00016,99622,68284,725,586,974,960,19,132,Your Next Daily Essential: See the Reviews!,Explore MiiR's everyday favorites and read authentic customer stories.,Wednesday,Email
01K0XXTJ13R2FMX2AKHE3YTKVR,July 25: Product Spotlight: New Standard Carafe,2025-07-25,06:00 PM,0.55196,0.00611,0.00693,0.00146,0.00015,101277,69029,966,764,873,867,19,183,Meet the New Standard in Coffee Gear.,Durable stainless steel and precise pour-over brewing. No mess. No cracks.,Friday,Email
01K0H52KCCDKA6ECRWAZPJJJRP,July 21: Generosity Driven,2025-07-21,06:00 PM,0.57619,0.00214,0.00694,0.00138,4e-05,102303,69828,362,259,852,841,5,168,Products with Purpose.,Details about your GiveCode™.,Monday,Email
01K0CJXPT74M081DR6KGTN65WN,June 18: Carryology,2025-07-18,10:30 AM,0.46178,0.00785,0.00684,0.01455,0.00015,106775,72820,1572,1238,1094,1078,24,2329,MiiR x Carryology Bottles are Here!,Your hydration routine just got an upgrade.,Friday,Email
01K04K0ET03SQ63F2ZEDV6YTWS,June 15: Product Engraving,2025-07-15,06:00 PM,0.55072,0.0039,0.00648,0.00095,0.00016,101146,69059,596,489,821,813,20,119,Make It Personal: Engrave Your MiiR Gear.,Customization made simple for gifts & teams.,Tuesday,Email
01JZQ6JCA9YWFZ2R1KEGB28EQK,June 9:Top Picks for Summer Adventures,2025-07-09,06:00 PM,0.46217,0.00499,0.00706,0.00987,0.00027,106201,73037,2032,789,1153,1116,42,1575,Adventure-Ready Gear for Every Summer Plan.,"MiiR favorites for hikes, road trips, beach days, and more.",Wednesday,Email
01JZ394GQM1JWQKS5HQRXN2007,July 2: BOGO Promo – Pourigami + Camp Cup,2025-07-02,10:30 AM,0.48782,0.00683,0.00925,0.01765,0.00033,110970,76342,2051,1069,1482,1447,52,2811,Your New Favorite Brew Duo (With a Gift Inside),"Grab the Pourigami, get the Camp Cup free.",Wednesday,Email
01JYRHATXRX8FW7HA88HGE6MWR,June 28th: Customer Testimony,2025-06-28,10:31 AM,0.60929,0.00352,0.00599,0.00122,0.00022,101095,69657,525,402,700,685,25,140,Why Thousands Choose MiiR,These real experiences say it better than we ever could.,Saturday,Email
01JYGVZZKT2MNHYWZYQ8WKFAT6,June 25th: Hydration Myths Busted,2025-06-25,10:30 AM,0.58565,0.00312,0.00564,0.00292,7e-05,97916,67447,450,359,662,650,8,337,Let’s bust some hydration myths.,"Turns out, your thirst doesn’t tell the full story.",Wednesday,Email
01JY8RHKDS3FABCWYR777M71SB,June 22nd: Blog Highlight,2025-06-22,10:30 AM,0.63233,0.00711,0.00563,0.00292,9e-05,107157,73429,1074,826,667,654,10,340,"Turkish-style Cold Brew? Yes, Please.",Plus a complimentary cold brew filter with every Tomo purchase.,Sunday,Email
01JXW8D1QQBJH8ZE71360Y4PJG,June 17th: National Camping Month,2025-06-17,06:00 PM,0.59987,0.00461,0.00529,0.00276,0.00019,101612,69930,751,537,622,617,22,323,Celebrate the outdoors!,Adventure ready gear built for camping.,Tuesday,Email
01JXF65NJB3DZ37F4DRXKX419W,June 13th: Impact Report 2024,2025-06-13,10:30 AM,0.58478,0.0049,0.00633,0.01838,0.00021,132529,92533,924,776,1023,1002,33,2963,"Reflecting on Impact, Together.",,Friday,Email
01JX495WCXSVBH781WZBBYGMX6,June 10th: Father’s Day Gifting Guide,2025-06-10,09:00 AM,0.6041,0.00603,0.00492,0.00314,7e-05,97427,67080,999,670,565,546,8,350,Gifts They Will Actually Use And Love!,"From morning coffee to weekend rides—functional, thoughtful, built to last.",Tuesday,Email
01JWX7PYEWRGTTD1TX2M53EZDJ,June 4th: Altitude Blue Launch,2025-06-04,01:00 PM,0.52718,0.00831,0.00592,0.02021,0.00021,119178,81549,1964,1285,932,915,33,3190,A New Hue Has Arrived,Introducing Altitude Blue—our latest limited-edition color is here.,Wednesday,Email
01JWR12F1HS5V8JNB8QMBHYKM7,June 2nd: Tomo + Cold brew filter,2025-06-02,12:00 PM,0.66802,0.0063,0.00668,0.00338,9e-05,112028,76425,868,721,778,764,10,388,Sip the Season,Free Cold Brew Filter with every Tomo.,Monday,Email
01JW1HKR15RYSEBZCSBEE0H8PY,May 25th: Free engraving PROMO,2025-05-25,12:00 PM,0.65623,0.00783,0.00633,0.00305,0.00021,109746,74987,1212,895,735,723,24,350,"Custom Gear, On Us.","Engrave your design, name, or message for free this month only.",Sunday,Email
01JVT97K4P4S2FY1S0ZQGPSFWJ,Win back promo - 1 year lapsed customers,2025-05-25,10:00 AM,0.67655,0.02826,0.0044,0.00151,0.0,8685,5386,477,225,36,35,0,12,You deserve better : save 15% this week only.,,Sunday,Email
01JVWJ7R4W2MM8V2PNJYFFQKW0,23 May: Product Spotlight - Chug Lid Email #3,2025-05-23,12:00 PM,0.83333,0.33333,0.0,0.0,0.0,20,10,12,4,0,0,0,0,We heard you! Let us make it right with the redesigned Leakproof Chug Lid.,,Friday,Email
01JVW2CC9RQBZJHF4EK7QMQ4XB,23 May: Product Spotlight - Chug Lid Email#1,2025-05-23,12:00 PM,0.56613,0.00942,0.00606,0.02353,0.00046,81233,55922,1270,931,605,599,45,2380,Meet Your New Favorite Lid,The new Chug Lid delivers big hydration with zero leaks.,Friday,Email
01JV9ZEXAGPVK2FNR5SQEX6EXK,"16 May: Hydration goals, Summer Ready",2025-05-16,07:00 PM,0.65106,0.0091,0.01053,0.00597,0.00039,44635,28390,519,397,469,459,17,262,Stay Cool. Sip Smarter. Summer Starts Here.,"Summer-ready sippers, hydration tips, and gear you’ll carry everywhere.",Friday,Email
01JTX5KES0HWF7T25J3EHW0AF0,10 May: Customer Favorites in Focus,2025-05-10,07:00 PM,0.59852,0.00831,0.00499,0.0018,0.00016,30634,19301,383,268,161,161,5,58,Fan Favorites You’ll Reach for Every Day,Discover why these bottles are topping customer carts—hydration never looked so good.,Saturday,Email
01JT6JV7G9566FP3BWNBTD0VQA,May 2025 | Free Etching promo,2025-05-02,12:00 PM,0.59719,0.00892,0.00482,0.00112,3e-05,28193,18084,391,270,148,146,1,34,Choose your canvas!,"Free etching on all MiiR, all month long.",Friday,Email
`,
    flow_data: `
Flow ID,Flow Name,Date,Message Channel,Status,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Recipients,Total Opens,Unique Opens,Total Clicks,Total Unsubscribes,Unique Unsubscribes,Spam Complaints,Bounces,Unique Clicks,Tags
RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,May 01 2025 - May 31 2025,Email,Manual,0.66802,0.0749,0.0081,0.01002,0.0,499,650,330,53,4,4,0,5,37,Q1 2025 Flows
UXVBcX,Q1 2025 | Back In Stock Flow,May 01 2025 - May 31 2025,Email,Live,0.65363,0.29609,0.00559,0.00556,0.0,180,257,117,94,1,1,0,1,53,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,May 01 2025 - May 31 2025,Email,Live,0.62064,0.03797,0.01036,0.00382,0.0,2617,2865,1618,134,27,27,0,10,99,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,May 01 2025 - May 31 2025,Email,Live,0.86207,0.2069,0.0,0.0,0.0,29,115,25,13,0,0,0,0,6,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,May 01 2025 - May 31 2025,Email,Live,0.67055,0.01984,0.03277,0.00301,0.0,2326,2654,1555,55,77,76,0,7,46,Q2 2025 Flows
TD7FaA,Q2 25 - Welcome Series - edible communities giveaway,May 01 2025 - May 31 2025,Email,Draft,0.62768,0.07637,0.10024,0.00711,0.00477,422,410,263,37,43,42,2,3,32,"Q1 2025 Flows, Welcome Series Main"
RxPmK8,Q4 2024 QO | Abandoned Checkout,May 01 2025 - May 31 2025,Email,Manual,0.62143,0.02679,0.00714,0.0106,0.00179,566,584,348,18,4,4,1,6,15,Q1 2025 Flows
SFFVE4,Q4 2024 QO | Welcome Series,May 01 2025 - May 31 2025,Email,Draft,0.50301,0.03026,0.02771,0.07516,0.00147,8076,6360,3757,315,213,207,11,607,226,"Q1 2025 Flows, Welcome Series Main"
Yw2MwN,free shipping Welcome Series,May 01 2025 - May 31 2025,Email,Draft,0.88,0.08,0.0,0.0,0.0,25,42,22,2,0,0,0,0,2,"Q1 2025 Flows, Welcome Series Main"
RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Jun 01 2025 - Jun 30 2025,Email,Manual,0.673,0.04753,0.0,0.0,0.0,526,646,354,31,0,0,0,0,25,Q1 2025 Flows
UXVBcX,Q1 2025 | Back In Stock Flow,Jun 01 2025 - Jun 30 2025,Email,Live,0.66667,0.31579,0.0,0.0,0.0,57,75,38,29,0,0,0,0,18,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,Jun 01 2025 - Jun 30 2025,Email,Live,0.64149,0.03886,0.0094,0.00156,0.00063,3196,3600,2047,166,30,30,2,5,124,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,Jun 01 2025 - Jun 30 2025,Email,Live,0.82927,0.09756,0.0,0.0,0.0,41,118,34,8,0,0,0,0,4,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,Jun 01 2025 - Jun 30 2025,Email,Live,0.69844,0.02735,0.02621,0.00416,0.00038,2644,3210,1839,111,71,69,1,11,72,Q2 2025 Flows
TD7FaA,Q2 25 - Welcome Series - edible communities giveaway,Jun 01 2025 - Jun 30 2025,Email,Draft,0.2541,0.0,0.04098,0.024,0.0,125,49,31,0,5,5,0,3,0,"Q1 2025 Flows, Welcome Series Main"
RxPmK8,Q4 2024 QO | Abandoned Checkout,Jun 01 2025 - Jun 30 2025,Email,Manual,0.50286,0.01714,0.00714,0.00709,0.0,705,559,352,16,5,5,0,5,12,Q1 2025 Flows
SFFVE4,Q4 2024 QO | Welcome Series,Jun 01 2025 - Jun 30 2025,Email,Draft,0.35201,0.0191,0.01568,0.08991,0.00122,14437,7918,4625,343,209,206,16,1298,251,"Q1 2025 Flows, Welcome Series Main"
Yw2MwN,free shipping Welcome Series,Jun 01 2025 - Jun 30 2025,Email,Draft,0.58333,0.0,0.0,0.0,0.0,24,18,14,0,0,0,0,0,0,"Q1 2025 Flows, Welcome Series Main"
RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Jul 01 2025 - Jul 31 2025,Email,Manual,0.6612,0.06922,0.00729,0.00363,0.0,551,613,363,56,4,4,0,2,38,Q1 2025 Flows
WTskmQ,Q1 2025 QO | Abandoned Cart Reminder (Aimerce),Jul 01 2025 - Jul 31 2025,Email,Draft,0.84848,0.0,0.0,0.0,0.0,33,49,28,0,0,0,0,0,0,Q1 2025 Flows
UXVBcX,Q1 2025 | Back In Stock Flow,Jul 01 2025 - Jul 31 2025,Email,Live,0.6014,0.26224,0.0,0.0,0.0,286,380,172,107,0,0,0,0,75,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,Jul 01 2025 - Jul 31 2025,Email,Live,0.6427,0.03942,0.01423,0.00291,0.0,2748,2928,1761,137,40,39,0,8,108,Q1 2025 Flows
UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),Jul 01 2025 - Jul 31 2025,Email,Live,0.78116,0.03647,0.00912,0.0,0.0,329,435,257,14,3,3,0,0,12,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,Jul 01 2025 - Jul 31 2025,Email,Live,0.73171,0.19512,0.0,0.0,0.0,41,92,30,10,0,0,0,0,8,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,Jul 01 2025 - Jul 31 2025,Email,Live,0.66928,0.01922,0.0413,0.00178,0.0,2814,3356,1880,75,117,116,0,5,54,Q2 2025 Flows
RxPmK8,Q4 2024 QO | Abandoned Checkout,Jul 01 2025 - Jul 31 2025,Email,Manual,0.48892,0.01582,0.01266,0.00629,0.0,636,502,309,12,8,8,0,4,10,Q1 2025 Flows
QNwnSn,Q4 2024 QO | Abandoned Checkout (Aimerce),Jul 01 2025 - Jul 31 2025,Email,Draft,0.78571,0.14286,0.0,0.0,0.0,14,14,11,4,0,0,0,0,2,Q1 2025 Flows
SFFVE4,Q4 2024 QO | Welcome Series,Jul 01 2025 - Jul 31 2025,Email,Draft,0.35887,0.02107,0.01917,0.04251,0.00066,14327,8554,4923,391,266,263,9,609,289,"Q1 2025 Flows, Welcome Series Main"
TiXiwE,RIQ | Welcome Series,Jul 01 2025 - Jul 31 2025,Email,Live,0.66667,0.0,0.0,0.0,0.0,3,2,2,0,0,0,0,0,0,"Q1 2025 Flows, Welcome Series Main"
XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,Jul 01 2025 - Jul 31 2025,Email,Live,0.50745,0.01915,0.00532,0.00106,0.00106,941,781,477,22,5,5,1,1,18,N/A
UXLWsi,KL Q3 2025 | Delivered/Post Purchase Flow - Party Speckle & Jubilee,Aug 01 2025 - Aug 31 2025,Email,Live,0.55963,0.00917,0.01835,0.0,0.0,109,93,61,1,3,2,0,0,1,Email
RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Aug 01 2025 - Aug 31 2025,Email,Manual,0.65262,0.03488,0.00872,0.00434,0.0,691,715,449,27,6,6,0,3,24,Q1 2025 Flows
WTskmQ,Q1 2025 QO | Abandoned Cart Reminder (Aimerce),Aug 01 2025 - Aug 31 2025,Email,Draft,0.65392,0.04164,0.00819,0.00204,0.0,1468,1645,958,78,12,12,0,3,61,Q1 2025 Flows
UXVBcX,Q1 2025 | Back In Stock Flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.71654,0.33858,0.0,0.00781,0.0,256,402,182,138,0,0,0,2,86,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,Aug 01 2025 - Aug 31 2025,Email,Live,0.67225,0.03717,0.01099,0.00261,0.0,3830,4401,2568,189,42,42,0,10,142,Q1 2025 Flows
UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),Aug 01 2025 - Aug 31 2025,Email,Live,0.66533,0.02407,0.01505,0.001,0.0,2994,3387,1990,96,46,45,0,3,72,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,Aug 01 2025 - Aug 31 2025,Email,Live,0.77273,0.20455,0.0,0.0,0.0,44,106,34,11,0,0,0,0,9,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,Aug 01 2025 - Aug 31 2025,Email,Live,0.67296,0.02473,0.03222,0.00227,0.00033,3080,3617,2068,106,103,99,1,7,76,Q2 2025 Flows
RxPmK8,Q4 2024 QO | Abandoned Checkout,Aug 01 2025 - Aug 31 2025,Email,Manual,0.51138,0.03684,0.02059,0.07792,0.0,1001,754,472,45,19,19,0,78,34,Q1 2025 Flows
QNwnSn,Q4 2024 QO | Abandoned Checkout (Aimerce),Aug 01 2025 - Aug 31 2025,Email,Draft,0.65977,0.03678,0.02529,0.04185,0.0,454,484,287,29,11,11,0,19,16,Q1 2025 Flows
SFFVE4,Q4 2024 QO | Welcome Series,Aug 01 2025 - Aug 31 2025,Email,Draft,0.57091,0.03653,0.03136,0.01882,0.00043,9458,9186,5298,479,300,291,4,178,339,"Q1 2025 Flows, Welcome Series Main"
XV5MwH,Site Abandonment Flow (Aimerce),Aug 01 2025 - Aug 31 2025,Email,Live,0.64909,0.03043,0.00811,0.01004,0.0,498,569,320,25,4,4,0,5,15,N/A
XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,Aug 01 2025 - Aug 31 2025,Email,Live,0.42478,0.02434,0.01327,0.0,0.0,452,344,192,12,6,6,0,0,11,N/A
Vt5BRX,[RFM] Churn prevention - Advanced KDP - RFM,Aug 01 2025 - Aug 31 2025,Email,Draft,0.57245,0.01162,0.00876,0.00136,3e-05,29393,24995,16803,439,259,257,1,40,341,N/A
RmY3Fu,[RFM] Loyal/Champion retention flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.67577,0.01991,0.00826,0.00063,0.0,4725,5489,3191,122,40,39,0,3,94,N/A
Sm3rUq,[RFM] MA - Next Best Product Cross-Sell,Aug 01 2025 - Aug 31 2025,Email,Live,0.62136,0.04854,0.02913,0.0,0.0,103,98,64,5,3,3,0,0,5,N/A
UySV7j,AIMERCE RIQ  |  Abandoned Cart,Sep 01 2025 - Sep 30 2025,Email,Live,0.67733,0.02667,0.0,0.00531,0.0,377,461,254,14,0,0,0,2,10,RIQ
XkRSLw,AIMERCE RIQ | Abandoned Checkout,Sep 01 2025 - Sep 30 2025,Email,Live,0.60944,0.01073,0.00429,0.01688,0.00215,474,511,284,8,2,2,1,8,5,RIQ
UXLWsi,KL Q3 2025 | Delivered/Post Purchase Flow - Party Speckle & Jubilee,Sep 01 2025 - Sep 30 2025,Email,Live,0.65401,0.01688,0.02954,0.0125,0.0,240,236,155,4,7,7,0,3,4,Email
Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,Sep 01 2025 - Sep 30 2025,Email,Live,0.54153,0.01102,0.00339,0.0084,0.0,1190,980,639,15,4,4,0,10,13,N/A
RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Sep 01 2025 - Sep 30 2025,Email,Manual,0.69774,0.04237,0.00847,0.00282,0.0,355,380,247,15,3,3,0,1,15,Q1 2025 Flows
WTskmQ,Q1 2025 QO | Abandoned Cart Reminder (Aimerce),Sep 01 2025 - Sep 30 2025,Email,Draft,0.66808,0.03531,0.00565,0.00562,0.0,712,826,473,53,4,4,0,4,25,Q1 2025 Flows
UXVBcX,Q1 2025 | Back In Stock Flow,Sep 01 2025 - Sep 30 2025,Email,Live,0.70507,0.29493,0.00922,0.00459,0.0,218,390,153,109,2,2,0,1,64,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,Sep 01 2025 - Sep 30 2025,Email,Live,0.62098,0.02629,0.00609,0.0034,0.00024,4122,4437,2551,149,25,25,1,14,108,Q1 2025 Flows
UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),Sep 01 2025 - Sep 30 2025,Email,Live,0.66875,0.01804,0.00977,0.00175,0.0,3998,4465,2669,100,39,39,0,7,72,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,Sep 01 2025 - Sep 30 2025,Email,Live,0.70115,0.13793,0.01149,0.0,0.0,87,177,61,16,2,1,0,0,12,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,Sep 01 2025 - Sep 30 2025,Email,Live,0.67852,0.02548,0.02579,0.00376,0.0,3191,3780,2157,104,83,82,0,12,81,Q2 2025 Flows
RxPmK8,Q4 2024 QO | Abandoned Checkout,Sep 01 2025 - Sep 30 2025,Email,Manual,0.38724,0.03189,0.00683,0.06794,0.0,471,300,170,27,3,3,0,32,14,Q1 2025 Flows
QNwnSn,Q4 2024 QO | Abandoned Checkout (Aimerce),Sep 01 2025 - Sep 30 2025,Email,Draft,0.60984,0.0623,0.01967,0.00651,0.0,307,321,186,37,6,6,0,2,19,Q1 2025 Flows
SFFVE4,Q4 2024 QO | Welcome Series,Sep 01 2025 - Sep 30 2025,Email,Draft,0.61787,0.03782,0.02967,0.01128,0.0,3102,3257,1895,152,93,91,0,35,116,"Q1 2025 Flows, Welcome Series Main"
TGnnV4,RIQ | Abandoned Cart,Sep 01 2025 - Sep 30 2025,Email,Live,0.63653,0.04244,0.00923,0.0055,0.0,1090,1357,690,60,10,10,0,6,46,RIQ
TgTC7w,RIQ | Abandoned Checkout,Sep 01 2025 - Sep 30 2025,Email,Live,0.5413,0.02754,0.01812,0.03699,0.0,1433,1331,747,53,26,25,0,53,38,RIQ
TiXiwE,RIQ | Welcome Series,Sep 01 2025 - Sep 30 2025,Email,Live,0.49794,0.03202,0.0228,0.0188,0.0,4202,3643,2053,186,94,94,0,79,132,"Q1 2025 Flows, Welcome Series Main"
XV5MwH,Site Abandonment Flow (Aimerce),Sep 01 2025 - Sep 30 2025,Email,Live,0.66207,0.04828,0.00345,0.01695,0.0,295,337,192,18,1,1,0,5,14,N/A
XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,Sep 01 2025 - Sep 30 2025,Email,Live,0.45413,0.01818,0.00909,0.00493,0.0,2432,1730,1099,56,23,22,0,12,44,N/A
RmY3Fu,[RFM] Loyal/Champion retention flow,Sep 01 2025 - Sep 30 2025,Email,Live,1.0,0.0,0.0,0.0,0.0,1,3,1,0,0,0,0,0,0,N/A
Sm3rUq,[RFM] MA - Next Best Product Cross-Sell,Sep 01 2025 - Sep 30 2025,Email,Live,0.57895,0.0,0.05263,0.0,0.0,19,21,11,0,1,1,0,0,0,N/A
UySV7j,AIMERCE RIQ  |  Abandoned Cart,Oct 01 2025 - Oct 30 2025,Email,Live,0.60963,0.01993,0.00166,0.00166,0.0,603,668,367,14,1,1,0,1,12,RIQ
XkRSLw,AIMERCE RIQ | Abandoned Checkout,Oct 01 2025 - Oct 30 2025,Email,Live,0.5773,0.01974,0.00658,0.03949,0.0,633,591,351,17,4,4,0,25,12,RIQ
UXLWsi,KL Q3 2025 | Delivered/Post Purchase Flow - Party Speckle & Jubilee,Oct 01 2025 - Oct 30 2025,Email,Live,0.71296,0.01852,0.01852,0.00917,0.0,109,126,77,2,2,2,0,1,2,Email
Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,Oct 01 2025 - Oct 30 2025,Email,Live,0.553,0.00922,0.0,0.01364,0.0,220,200,120,3,0,0,0,3,2,N/A
UXVBcX,Q1 2025 | Back In Stock Flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.67606,0.3662,0.01408,0.01389,0.0,144,219,96,90,2,2,0,2,52,Q1 2025 Flows
SLYp8Z,Q2 2025 | Browse Abandonment,Oct 01 2025 - Oct 30 2025,Email,Live,0.60761,0.02519,0.00687,0.00114,0.0,3498,3496,2123,116,24,24,0,4,88,Q1 2025 Flows
UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),Oct 01 2025 - Oct 30 2025,Email,Live,0.67059,0.02221,0.00697,0.00087,0.0,4597,4944,3080,173,32,32,0,4,102,Q1 2025 Flows
QNBTmC,Q2 2025 | PDP Customer Review,Oct 01 2025 - Oct 30 2025,Email,Live,0.91667,0.25,0.0,0.0,0.0,12,36,11,3,0,0,0,0,3,N/A
SZVgVH,Q2 2025 | Post Purchase Flow V2,Oct 01 2025 - Oct 30 2025,Email,Live,0.68482,0.01815,0.02653,0.00417,0.0,2877,3267,1962,67,76,76,0,12,52,Q2 2025 Flows
TGnnV4,RIQ | Abandoned Cart,Oct 01 2025 - Oct 30 2025,Email,Live,0.64268,0.0335,0.00993,0.00494,0.0,810,936,518,35,8,8,0,4,27,RIQ
TgTC7w,RIQ | Abandoned Checkout,Oct 01 2025 - Oct 30 2025,Email,Live,0.5995,0.03904,0.00504,0.01975,0.0,810,777,476,44,4,4,0,16,31,RIQ
TiXiwE,RIQ | Welcome Series,Oct 01 2025 - Oct 30 2025,Email,Live,0.56618,0.03042,0.02082,0.00826,0.00054,5569,5160,3127,206,115,115,3,46,168,"Q1 2025 Flows, Welcome Series Main"
XV5MwH,Site Abandonment Flow (Aimerce),Oct 01 2025 - Oct 30 2025,Email,Live,0.60667,0.02333,0.01333,0.01316,0.00333,304,331,182,13,4,4,1,4,7,N/A
XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,Oct 01 2025 - Oct 30 2025,Email,Live,0.43439,0.0158,0.00575,0.00524,0.00048,2099,1367,907,41,12,12,1,11,33,N/A
RmY3Fu,[RFM] Loyal/Champion retention flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.5,0.0,0.0,0.0,0.0,2,2,1,0,0,0,0,0,0,N/A
Sm3rUq,[RFM] MA - Next Best Product Cross-Sell,Oct 01 2025 - Oct 30 2025,Email,Live,0.67829,0.01938,0.03488,0.00769,0.0,260,297,175,7,9,9,0,2,5,N/A
`,
    revenue: `Month,campaign_revenue,email_revenue,flow_revenue,brand_revenue
May 2025,6805.0,15899.47,9094.47,114577.8
June 2025,13674.67,26643.10,12968.43,118075.78
July 2025,12352.2,27371.03,15018.83,125860.74
August 2025,13616.65,35803.81,22187.16,161302.73
September 2025,19521.02,36666.47,17145.45,149504.45
October 2025,16265.41,30960.80,14695.39,147722.48
`,
  },
};

// ============================================================================
// SYSTEM PROMPT GENERATOR WITH CHART INSTRUCTIONS
// ============================================================================

function generateSystemPrompt(brandKey) {
  const brand = BRANDS[brandKey];
  return `You are an expert Klaviyo Analytics Assistant for ${brand.name}.

BRAND CONTEXT:
${brand.description}

---
AVAILABLE DATA:

CAMPAIGN DATA:
${brand.campaign_data}

FLOW DATA:
${brand.flow_data}

FORMS DATA:
${brand.forms_data}

REVENUE DATA:
${brand.revenue}

---
YOUR ROLE AND CAPABILITIES:

1. **Data Analysis**: Analyze campaign, flow, form, and revenue performance data
2. **Answer Questions**: Provide clear, data-driven insights with specific metrics
3. **Generate Visualizations**: Create chart specifications when users request visual data representation
4. **Strategic Recommendations**: Offer actionable advice based on performance trends and benchmarks

---
WHEN TO GENERATE CHARTS:

Generate chart JSON when users use phrases like:
- "plot", "chart", "show me", "visualize", "graph"
- "compare", "trend", "over time"
- "top performing", "best/worst campaigns"
- Any request for visual representation of data

---
CHART GENERATION SPECIFICATIONS:

**Required JSON Structure:**
\`\`\`json
{
  "type": "line|bar|pie",
  "title": "Descriptive Chart Title",
  "data": [
    {"name": "Item 1", "value": 70.8, "metric2": 0.41},
    {"name": "Item 2", "value": 67.5, "metric2": 0.49}
  ],
  "xKey": "name",
  "lines": [
    {"key": "value", "name": "Metric Display Name"}
  ],
  "bars": [
    {"key": "value", "name": "Metric Display Name"}
  ],
  "valueKey": "value"
}
\`\`\`

**Chart Type Selection Guidelines:**
- **Line charts**: Time-series data, trends over multiple dates, sequential progression
- **Bar charts**: Comparing discrete categories, campaign performance comparisons, metric comparisons
- **Pie charts**: Composition/distribution data with 6-8 segments maximum

**Data Formatting Requirements:**
- Campaign names: Maximum 20 characters (truncate with "..." if longer)
- Percentages: Round to 1 decimal place (e.g., 67.5%)
- Rates: Convert to percentages where applicable (0.675 → 67.5%)
- Limit data points: Show top 10-15 items for readability
- Sort data: Highest to lowest for rankings, chronological for time-series

**Multiple Metrics:**
- Use "lines" array for line charts with multiple series
- Use "bars" array for grouped bar charts
- Each metric needs: "key" (data field) and "name" (display label)

---
EXAMPLE INTERACTIONS:

**Example 1: Single Metric Bar Chart**
USER: "Show me the top 5 campaigns by open rate"

RESPONSE:
"Here are the top 5 campaigns by open rate:

1. Mother's/Father's Day Opt Out - 70.8%
2. Summer Sneak Peek - 67.55%
3. Golden Grove Launch - 67.5%
4. Cabana Release - 65.77%
5. Cabana Feature - 65.48%

These campaigns significantly exceed the 60% benchmark for excellent performance.

\`\`\`json
{
  "type": "bar",
  "title": "Top 5 Campaigns by Open Rate",
  "data": [
    {"name": "Mother's Day Opt", "open_rate": 70.8},
    {"name": "Summer Sneak Peek", "open_rate": 67.6},
    {"name": "Golden Grove", "open_rate": 67.5},
    {"name": "Cabana Release", "open_rate": 65.8},
    {"name": "Cabana Feature", "open_rate": 65.5}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"}
  ]
}
\`\`\`"

**Example 2: Multi-Metric Comparison**
USER: "Compare open rates and click rates for recent campaigns"

RESPONSE:
"Here's a comparison of open rates vs click rates for recent campaigns:

The data shows a positive correlation between open and click rates. Mother's Day Opt Out leads in opens (70.8%) with solid clicks (0.41%), while Summer Sneak Peek achieved the highest click rate (1.18%) despite slightly lower opens (67.55%).

Key insight: Campaigns with personalized subject lines tend to perform better in both metrics.

\`\`\`json
{
  "type": "bar",
  "title": "Open Rate vs Click Rate Comparison",
  "data": [
    {"name": "Mother's Day Opt", "open_rate": 70.8, "click_rate": 0.41},
    {"name": "Summer Sneak", "open_rate": 67.6, "click_rate": 1.18},
    {"name": "Golden Grove", "open_rate": 67.5, "click_rate": 0.49},
    {"name": "Cabana Release", "open_rate": 65.8, "click_rate": 0.37},
    {"name": "Cabana Feature", "open_rate": 65.5, "click_rate": 0.82}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"},
    {"key": "click_rate", "name": "Click Rate (%)"}
  ]
}
\`\`\`"

**Example 3: Time-Series Line Chart**
USER: "Plot revenue trends over time"

RESPONSE:
"Here's the revenue trend analysis:

Total revenue has grown from $114.6K in May to $147.7K in October, showing strong upward momentum. August saw the highest performance at $161.3K, driven by successful summer campaigns.

\`\`\`json
{
  "type": "line",
  "title": "Monthly Revenue Trends (May - Oct 2025)",
  "data": [
    {"name": "May", "brand_revenue": 114.6, "email_revenue": 15.9},
    {"name": "June", "brand_revenue": 118.1, "email_revenue": 26.6},
    {"name": "July", "brand_revenue": 125.9, "email_revenue": 27.4},
    {"name": "August", "brand_revenue": 161.3, "email_revenue": 35.8},
    {"name": "September", "brand_revenue": 149.5, "email_revenue": 36.7},
    {"name": "October", "brand_revenue": 147.7, "email_revenue": 31.0}
  ],
  "xKey": "name",
  "lines": [
    {"key": "brand_revenue", "name": "Total Revenue ($K)"},
    {"key": "email_revenue", "name": "Email Revenue ($K)"}
  ]
}
\`\`\`"
PERFORMANCE BENCHMARKS:

**Email Campaigns:**
- Open Rate: Good ≥ 40% | Excellent ≥ 60%
- Click Rate: Good ≥ 2% | Excellent ≥ 5%
- Click-to-Open Rate: Good ≥ 10% | Excellent ≥ 15%
- Unsubscribe Rate: Acceptable < 0.3% | Concerning > 0.5%
- Bounce Rate: Acceptable < 2% | Problematic > 3%

**Flows:**
- Should outperform campaign averages by 20-30%
- Welcome series: Target 60%+ open rate
- Abandoned cart: Target 40%+ open rate, 10%+ click rate

**Forms:**
- Submit rate: Good ≥ 3% | Excellent ≥ 5%
- View-to-submit: Target ratio should improve over time

---
RESPONSE GUIDELINES:

**Structure:**
1. Direct answer with specific data points
2. Context and insights (why the numbers matter)
3. Visualization (if requested or helpful)
4. Actionable recommendation (when appropriate)

**Style:**
- Write in a clear, executive-friendly tone as if presenting to a CEO or brand owner
- Use specific metrics and campaign names
- Explain insights in business terms, not just technical metrics
- Format numbers consistently (percentages with %, dollar amounts with $K/$M)
- Use strategic structure: Executive Summary → Key Metrics → Analysis → Recommendations

**Formatting Guidelines:**
- Use **bold** for section headers and key metrics
- Use clear paragraph breaks for readability
- Present comparisons in table-like format when comparing periods
- Avoid excessive bullet points; use them only for 3-5 key items
- Present data in a narrative format that tells a story

**Response Structure Template:**
[Opening statement with key finding]

**Key Metrics:**
• Metric 1: Value (context)
• Metric 2: Value (context)
• Metric 3: Value (context)

**Analysis:**
[2-3 paragraphs explaining what the numbers mean for the business]

**Recommendation:**
[1-2 clear action items based on the data]

**When Creating Charts:**
- ALWAYS provide executive summary BEFORE the JSON
- Frame insights around business impact (revenue, engagement, ROI)
- Keep chart titles clear and business-focused
- Ensure data is sorted logically (usually highest to lowest)

**Don't:**
- Generate charts unless specifically requested or clearly beneficial
- Use technical jargon without business context
- Present raw numbers without interpretation
- Create wall-of-text responses; use white space strategically
- Make assumptions about data not in the dataset

---
FIRST INTERACTION:

When starting a conversation, greet the user warmly and:
1. Introduce yourself as the ${brand.name} analytics assistant
2. Briefly mention available data types (campaigns, flows, forms, revenue)
3. Offer examples of questions you can answer
4. Let them know you can create visualizations

Example: "Hi! I'm your ${brand.name} analytics assistant. I have access to your campaign performance, flow metrics, form data, and revenue trends. I can answer questions like 'Which campaigns performed best?' or 'Show me revenue trends over time.' I can also create charts to visualize your data. What would you like to explore?"`;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

const sessions = new Map();

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function callOpenAI(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error(`OpenAI API attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// ============================================================================
// ROUTES
// ============================================================================

// Get available brands
app.get("/api/brands", (req, res) => {
  const brandList = Object.entries(BRANDS).map(([key, brand]) => ({
    id: key,
    name: brand.name,
    description: brand.description,
  }));

  res.json({ brands: brandList });
});

// Start a new chat session with a specific brand
app.post("/api/start", async (req, res) => {
  try {
    const { brandKey } = req.body;

    if (!brandKey || !BRANDS[brandKey]) {
      return res.status(400).json({
        error: "Invalid brand key. Please select a valid brand.",
        availableBrands: Object.keys(BRANDS),
      });
    }

    const sessionId = generateSessionId();
    const systemPrompt = generateSystemPrompt(brandKey);

    // Initialize session
    sessions.set(sessionId, {
      brandKey,
      chatHistory: [],
      systemPrompt,
    });

    // Generate initial greeting
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Hello, I just started a session." },
    ];

    const greeting = await callOpenAI(messages);

    // Add greeting to history
    sessions.get(sessionId).chatHistory.push({
      role: "assistant",
      content: greeting,
    });

    res.json({
      sessionId,
      brandName: BRANDS[brandKey].name,
      greeting,
      status: "ready",
    });
  } catch (error) {
    console.error("Start session error:", error);
    res.status(500).json({
      error: "Failed to initialize chat session",
      status: "error",
    });
  }
});

// Send a chat message
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(400).json({
        error: "Invalid or expired session. Please start a new session.",
        status: "session_expired",
      });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const session = sessions.get(sessionId);

    // Add user message to history
    session.chatHistory.push({ role: "user", content: message });

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: session.systemPrompt },
      ...session.chatHistory,
    ];

    // Get AI response
    const aiResponse = await callOpenAI(messages);

    // Add AI response to history
    session.chatHistory.push({ role: "assistant", content: aiResponse });

    res.json({
      response: aiResponse,
      status: "success",
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Sorry, I encountered an error. Please try again.",
      status: "error",
    });
  }
});

// Reset/clear a session
app.post("/api/reset", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({
      error: "Invalid session ID",
      status: "invalid_session",
    });
  }

  const session = sessions.get(sessionId);
  session.chatHistory = [];

  res.json({
    message: "Chat history cleared",
    brandName: BRANDS[session.brandKey].name,
    status: "reset",
  });
});

// End a session
app.post("/api/end", (req, res) => {
  const { sessionId } = req.body;

  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }

  res.json({
    message: "Session ended",
    status: "ended",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    activeSessions: sessions.size,
    availableBrands: Object.keys(BRANDS).length,
    timestamp: new Date().toISOString(),
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Clean up old sessions (run periodically)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [sessionId, session] of sessions.entries()) {
    const sessionTime = parseInt(sessionId.split("_")[1]);
    if (now - sessionTime > maxAge) {
      sessions.delete(sessionId);
      console.log(`Cleaned up expired session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

app.listen(PORT, () => {
  console.log(`Zipsense Analytics Server running on port ${PORT}`);
  console.log(`Available brands: ${Object.keys(BRANDS).join(", ")}`);
});

module.exports = app;
