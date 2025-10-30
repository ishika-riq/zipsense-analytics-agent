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
  2: {
    name: "Grow Fragrance",
    description:
      "Grow Fragrance is a modern home fragrance brand that creates 100% plant-based air fresheners and candles designed to smell amazing while being safe for people and the planet. Founded with the goal of replacing traditional synthetic fragrances, Grow uses real botanicals and essential oils to craft clean, non-toxic scents that elevate any space without harmful chemicals.",
    forms_data: `form_id,form_name,form_status,created_at,updated_at,closed_form,viewed_form,viewed_form_uniques,submits,submit_rate
SdXAFr,Email Subscribe Signup form - Web,live,2025-09-22T19:55:04+00:00,2025-09-22T19:55:04+00:00,0.0,5.0,2.0,0.0,0.0
W84UV7,RIQ: MIIR: Signup-New-(mobile/SMS),live,2025-07-28T12:42:30+00:00,2025-07-28T12:42:30+00:00,68756.0,84753.0,67014.0,3161.0,0.0373
UrTNaJ,RIQ: MIIR: Signup-New-(Desktop),live,2025-07-28T11:31:09+00:00,2025-07-28T11:31:09+00:00,28053.0,69554.0,50760.0,1110.0,0.01596
RsPaK5,DTC:  SMS opt in for email subscribers,live,2025-05-20T17:25:45+00:00,2025-05-20T17:25:45+00:00,5315.0,7064.0,5485.0,581.0,0.08225
`,
    campaign_data: `
    Campaign Message ID,Campaign Message Name,Send Date,Send Time,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Clicks,Unique Clicks,Total Unsubscribes,Unique Unsubscribes,Spam Complaints,Bounces,Subject,Preview Text,Day of Week,Campaign Message Channel
01K8QRGKHBPS4K6DEGWVRCYJ9G,[SMS] Holiday Launch,2025-10-29,05:00 PM,,0.18444,0.00868,,,,,616,595,28,28,,,,,Wednesday,SMS
01K8NHDYT3JNJPY9D9R95TN4KP,RIQ: 29th Oct - Holiday Scent Teaser ,2025-10-29,04:00 PM,0.67253,0.01622,0.00128,0.00133,7e-05,43048.0,37772.0,1290,911,72,72,4.0,75.0,Holiday Scents Are Coming to Town 🎅,,Wednesday,Email
01K8B47VEVACG0EATR07MTBDVH,RIQ: 26th Oct - Fragranceverse,2025-10-27,08:30 AM,0.73357,0.00512,0.00283,0.00156,2e-05,48698.0,41426.0,364,289,160,160,1.0,88.0,You’ve been summoned to Blondewood ✨,,Monday,Email
01K7VNKPXMYACND21D0BAQNHW8,RIQ: 23rd October - Halloween Scent,2025-10-23,09:30 AM,0.54398,0.00525,0.00257,0.00399,8e-05,51161.0,42509.0,500,410,201,201,6.0,313.0,The Scent of Halloween Is Here 👻🎃,,Thursday,Email
01K7V30VDDZE3J853QP5RNHMPZ,RIQ: 20th October,2025-10-20,11:00 AM,0.68647,0.00425,0.00295,0.00996,3e-05,51880.0,42629.0,360,264,183,183,2.0,625.0,Where Is Your Fragrance Really Made? 🌎,,Monday,Email
01K7Q47MJKHMRQFC73DKAP53Y8,[SMS] Fall Scent Winner,2025-10-17,05:00 PM,,0.15388,0.00501,,,,,488,307,10,10,,,,,Friday,SMS
01K7RG009QHA6G78F6R4ZTV6JV,RIQ: 17th Oct - Fall Scent Winner,2025-10-17,03:30 PM,0.63842,0.00726,0.00187,0.00182,3e-05,53463.0,43106.0,627,490,126,126,2.0,123.0,We Have a Winner! 🥁🍁,,Friday,Email
01K6Z866EP82HD003Q93NRQ82W,RIQ: 8th October Best seller highlight,2025-10-15,10:30 AM,0.3583,0.00291,0.00286,0.0098,0.00033,16236.0,13173.0,141,107,105,105,12.0,364.0,What’s All the Hype About? Our Top Scents Explained!,,Wednesday,Email
01K7EX0S26DCR7P7MF8XFKS9DZ,RIQ: 14th October,2025-10-14,12:00 PM,0.87556,0.00388,0.00197,0.00308,0.00012,46830.0,37692.0,226,167,85,85,5.0,133.0,🎉 Meet the Glow Game Winners! (You might know them…),,Tuesday,Email
01K7EMY9Y4HRR1XJZ14VTDBHTJ,RIQ: 13th October - National Book Month,2025-10-13,03:00 PM,0.60759,0.00553,0.00246,0.00462,0.00011,53916.0,43478.0,622,396,176,176,8.0,332.0,Light Up Your Reading Nook This Book Month 🕯️✨,,Monday,Email
01K6Z8RP3JJWW2167AQAVSWQCS,[SMS] Discovery Set,2025-10-08,12:00 PM,,0.17707,0.01681,,,,,532,295,28,28,,,,,Wednesday,SMS
01K6Z7VRYPTK7B5SQFRHB350JJ,RIQ: 7th Sept - Discovery Set ,2025-10-08,10:30 AM,0.49722,0.00418,0.00338,0.01156,0.0002,15615.0,12502.0,175,105,85,85,5.0,294.0,Which scent will you fall in love with? 💖,,Wednesday,Email
01K6MWC2KW1GKJ404HFGKY4HJ1,RIQ: 3rd Oct - Fall Scent Survey,2025-10-03,02:30 PM,0.4831,0.03584,0.00266,0.00245,0.0,3138.0,2359.0,244,175,13,13,0.0,12.0,🍁 Vote for Your Favorite Fall Scent,,Friday,Email
01K6FQHK2VZ2TQ4F2FC87PNFJ5,RIQ: 2nd October,2025-10-01,03:30 PM,0.42452,0.00504,0.00296,0.00582,0.00015,56367.0,43893.0,1045,521,306,306,15.0,605.0,Play the Glow Game → Win $100 💳✨,,Wednesday,Email
01K6D0EZ7ZTY516KX4VMS790V4,RIQ : 30th September,2025-09-30,03:30 PM,0.66732,0.00547,0.00219,0.00352,0.00014,55520.0,43588.0,489,357,143,143,9.0,231.0,Plot Twist: Candles and Cars Have Something in Common 🚗🕯️,,Tuesday,Email
01K62YYJY241S7RSAA2JS3FXXM,RIQ: 27th September - Fall Movies,2025-09-27,10:00 AM,0.53134,0.00396,0.00266,0.00525,9e-05,54642.0,43152.0,472,322,216,216,7.0,429.0,"Lights, Camera, Cozy: Your Fall Movie & Candle Guide 🎬✨",,Saturday,Email
01K5RA4HE0SFWB0SHQBCGC9TZY,RIQ: 25th September,2025-09-25,09:30 AM,0.54716,0.0053,0.00228,0.00338,0.00017,54431.0,42809.0,497,415,178,178,13.0,265.0,Enter the Fragranceverse: Ginger Pumpkin awaits🚪,,Thursday,Email
01K5RDRX33SHHSFQRCB9R7HFTE,RIQ:22nd Sept - First Day of Fall,2025-09-22,03:00 PM,0.64934,0.00548,0.00234,0.00361,7e-05,55537.0,43610.0,446,368,157,157,5.0,243.0,It’s Here: The First Day of Fall 🍂,,Monday,Email
01K5K718F7VFK8X76WW763AYBQ,RIQ:20th Sept - Pear Cider Follow-up,2025-09-20,02:30 PM,0.71162,0.00581,0.00209,0.00453,8e-05,55846.0,43824.0,439,358,129,129,5.0,280.0,🍐✨ Fall Into Comfort with Pear Cider,,Saturday,Email
01K5977WKH1RYFXX4Z7A2BW3Z0,RIQ:18th Sept - Pear Cider Launch,2025-09-18,08:45 AM,0.4256,0.00663,0.00285,0.0075,0.00016,57401.0,44833.0,854,698,300,300,17.0,796.0,🍐 New Scent: Pear Cider has arrived,,Thursday,Email
01K593W7X7JA9ZX6V0C1QTM7QT,RIQ: 17th September Join the waitlist.,2025-09-17,01:30 PM,0.71516,0.01171,0.00183,0.00416,3e-05,56320.0,44047.0,929,721,113,113,2.0,257.0,🍐 New fall fragrance lands tomorrow,,Wednesday,Email
01K563D231D5VP2C3NBE5RHH4Y,RIQ:15th September,2025-09-15,02:00 PM,0.64618,0.00535,0.00274,0.007,0.00011,53827.0,42236.0,446,350,182,179,7.0,461.0,🔥Fragrance Showdown: Grow vs Big Box,,Monday,Email
01K4SWZ3Y0AB5FWHJ50FR3AFP3,RIQ: 11th September - Easy Hack,2025-09-11,03:30 PM,0.61246,0.00651,0.00292,0.00407,7e-05,56869.0,44491.0,624,473,217,212,5.0,297.0,We’re letting you in on our cozy sweater secret 🧣,,Thursday,Email
01K4AQGPFPGAMDS9BY8A0HYT6M,RIQ:7th Sept - 3 Wick Candle Feature,2025-09-07,10:00 AM,0.54026,0.01548,0.00405,0.0023,6e-05,22599.0,17591.0,657,504,134,132,2.0,75.0,One candle. Three flames. Big energy.,,Sunday,Email
01K4AJ6VFVQYQB63R4GMGPH704,RIQ: 4th Sept (clone),2025-09-04,11:30 AM,0.56364,0.00457,0.00296,0.007,0.00017,53505.0,41910.0,480,340,222,220,13.0,524.0,Spot These 3 Sneaky Toxins in 5 Seconds,,Thursday,Email
01K4807QG7GDCY4WMRPFH68FBA,RIQ: 4th Sept,2025-09-04,10:30 AM,0.56503,0.00536,0.00364,0.00784,0.00022,32178.0,25310.0,344,240,165,163,10.0,354.0,Spot These 3 Sneaky Toxins in 5 Seconds,,Thursday,Email
01K3V661JEX92TS9A6CYBRMBZ2,RIQ:1st Sept - Labor Day ,2025-09-01,10:00 AM,0.61395,0.00546,0.00505,0.00397,0.00011,54242.0,42951.0,464,382,357,353,8.0,279.0,Wishing You a Calm & Cozy Labor Day 🍃,,Monday,Email
01K3RADCMSM44H9QEB0J5KVNFX,[SMS] Texas SMS,2025-08-28,02:00 PM,,0.12281,0.0,,,,,8,7,0,0,,,,,Thursday,SMS
01K3GXC6C81KZ6FXSBYK3DQP1H,RIQ:28th August - Autumn Heirloom,2025-08-28,02:00 PM,0.54178,0.01056,0.00569,0.00328,7e-05,18916.0,14473.0,342,282,156,152,2.0,88.0,Experience the season’s most beloved scent 🍂✨,,Thursday,Email
01K3G8WWWKKEV0X80354XW36M4,RIQ: 26th August - National Dog Day,2025-08-26,11:00 AM,0.7159,0.00205,0.00615,0.0,0.0,936.0,698.0,2,2,6,6,0.0,0.0,"Celebrate National Dog Day with Safe, Cruelty-Free Fragrance 🌿🐾",,Tuesday,Email
01K3K70AC0E58ECSA8YEKAHAAD,RIQ: 26th August - National Dog Day (clone),2025-08-26,09:30 AM,0.61011,0.00481,0.00599,0.00098,0.00013,54499.0,43107.0,462,340,434,423,9.0,69.0,"Celebrate National Dog Day with Safe, Cruelty-Free Fragrance 🌿🐾",,Tuesday,Email
01K3GTSFVARNV2NFRY5AZBMT96,RIQ:23rd August - Refill Email (Personalized),2025-08-25,02:00 PM,0.47534,0.01229,0.00556,0.0015,0.00017,10937.0,8549.0,295,221,101,100,3.0,27.0,Your candle’s ready for a refill 🕯️,,Monday,Email
01K396A6DHST6WWQ3Z6VB0381Q,RIQ:23rd August - Refill Email,2025-08-23,11:00 AM,0.5431,0.04023,0.00575,0.00287,0.0,258.0,189.0,19,14,2,2,0.0,1.0,Your candle’s ready for a refill 🕯️,,Saturday,Email
01K2Z6E6EEMWX4ZAXCSTNB931A,RIQ:21st August - Behind the Scent: Flannel,2025-08-21,11:45 AM,0.56561,0.00481,0.00652,0.00128,6e-05,46689.0,36688.0,380,312,428,423,4.0,83.0,Behind the Scent: Flannel & Leaves 🍁,,Thursday,Email
01K2Z5WXJ3PG1W34SVS85P16EV,RIQ:19th August - Flannel + leaves: new scent feature,2025-08-19,11:00 AM,0.67893,0.00723,0.00681,0.00244,0.00016,54396.0,42544.0,624,453,433,427,10.0,153.0,Meet the new scent of fall - just launched! 🍂,,Tuesday,Email
01K2S8FTP54QNGE9KTVXB9YGV5,RIQ:16th August - Fall Launch Follow-Up,2025-08-16,11:00 AM,0.54782,0.01769,0.00792,0.0009,0.00016,17425.0,13347.0,575,431,193,193,4.0,22.0,Have you met our new fall scents yet? 🍁,,Saturday,Email
01K2M44ZE0DAKYXD145NE9G7Z6,[MMS] Fall Collection Launch,2025-08-14,12:00 PM,,0.18177,0.00339,,,,,419,375,7,7,,,,,Thursday,SMS
01K2578R1XBXYAHVPY6MQVFQ9N,RIQ:14th August - Fall Collection Launch ,2025-08-14,08:30 AM,0.56795,0.01628,0.00732,0.00333,7e-05,48578.0,37933.0,1511,1087,495,489,5.0,223.0,It smells like fall in here  🍂,,Thursday,Email
01K24W0SE6T6FM3FNSWJJ72WV0,RIQ:12th August - Fall Collection Teaser,2025-08-12,02:00 PM,0.67595,0.0108,0.00832,0.00196,0.0002,55844.0,43694.0,983,698,544,538,13.0,127.0,Fall’s Finest Scents Are Almost Here 🍁,,Tuesday,Email
01K1XKH5CQR6ZJPDFQ1WAKMYBW,Car Freshner Follow-Up,2025-08-09,09:30 AM,0.17051,0.00467,0.01219,0.00199,0.0,6602.0,5555.0,220,152,402,397,0.0,65.0,That moment when your car smells too good..,,Saturday,Email
01K22CHG8B14FEDTTP2RT4MWFQ,[MMS] Car Freshner Launch,2025-08-07,12:09 PM,,0.1527,0.0053,,,,,332,317,11,11,,,,,Thursday,SMS
01K1XJ1G6H29VSGG4SRQEEXZS0,7th August - Car Freshener Launch (Waitlist/Repeats),2025-08-07,11:00 AM,0.48284,0.01885,0.00696,0.00179,0.0,2844.0,2152.0,173,84,31,31,0.0,8.0,NEW: Car Fresheners Got a Glow Up 🚗✨,,Thursday,Email
01K22BF832X2W9CPTN5DZ1J9MS,7th August - Car Freshener Launch (full list),2025-08-07,09:28 AM,0.46996,0.00625,0.00748,0.00487,0.00013,53442.0,41826.0,706,556,674,666,12.0,436.0,NEW: Car Fresheners Got a Glow Up 🚗✨,,Thursday,Email
01K1XGRKKZCP2E8C3FN9EAETNY,5th August - Car Freshner Teaser (clone),2025-08-05,02:00 PM,0.67159,0.00994,0.0092,0.00203,6e-05,55640.0,43235.0,861,640,600,592,4.0,131.0,We’ve been working on something fresh,,Tuesday,Email
01K1G4DP4FJWKNS40WZBD52APA,RIQ:2nd August,2025-08-02,11:00 AM,0.47779,0.00338,0.01087,0.01153,0.00029,16982.0,13273.0,160,94,308,302,8.0,324.0,✨ “As seen in People Magazine…”,,Saturday,Email
01K18R3Z4HTJF3S9Q1B0DHXA4H,Pacific Driftwood Reviews 2025,2025-07-30,01:00 AM,0.70669,0.00738,0.00871,0.00215,9e-05,65869.0,48867.0,710,510,612,602,6.0,149.0,Smells too good to be this clean 💙,Rave reviews. Non-toxic. Loved by you.,Wednesday,Email
01K1403CNPP8DXZ3FHMBG3R2VY,[Follow-up] Last Call Summer Email 2025,2025-07-28,08:23 PM,0.39534,0.00645,0.01472,0.00083,0.0,6056.0,4780.0,101,78,179,178,0.0,10.0,Last Chance for Summer Faves! ⛱️,"Last chance to grab Cabana, Coastal Tide, and Coconut Pineapple",Monday,Email
01JWXJSP38RWEQJ0FM9MGRRP0A,Last Call Summer Email 2025,2025-07-26,08:23 AM,0.62246,0.00509,0.00753,0.00325,8e-05,62191.0,46960.0,519,384,573,568,6.0,246.0,Low stock alert: Your summer favorites,"Last chance to grab Cabana, Coastal Tide, and Coconut Pineapple",Saturday,Email
01JWXTK2RC08NHWNHSXZ2KYHX1,Summer Last Call SMS 2025,2025-07-25,12:36 PM,,0.13194,0.00794,,,,,271,266,16,16,,,,,Friday,SMS
01K0Q0EYNGH5290PDG1FG7H519,Pacific Driftwood Review Ask,2025-07-23,07:45 PM,0.6822,0.05085,0.01271,0.00211,0.0,475.0,322.0,27,24,6,6,0.0,1.0,Can we ask you something?,"You gave our new scent a chance, thank you 💙",Wednesday,Email
01K0Q73KPFCD4RXBH9X8PFEMKF,Spray it where? Email Campaign,2025-07-22,01:00 AM,0.71235,0.00728,0.008,0.00213,4e-05,65846.0,49124.0,681,502,561,552,3.0,147.0,Don’t sleep on these spray hacks (or this deal),Our best spray tips + $2 off each when you grab more than one,Tuesday,Email
01K0CXYQ31NNGREVKGXZ0WJ5NZ,[Follow-up] Behind the Scent: Pacific Driftwood,2025-07-19,09:19 AM,0.49551,0.00706,0.00863,0.00174,0.0,7031.0,5685.0,259,81,100,99,0.0,20.0,How this scent won over our entire team,It was love at first smell 💙,Saturday,Email
01JWXJ9F51M95V5GB3M180SBKZ,Behind the Scent: Pacific Driftwood,2025-07-17,09:19 AM,0.74484,0.00448,0.00647,0.00228,8e-05,61761.0,46359.0,387,279,411,403,5.0,142.0,“Wait… what is that?”,It was love at first smell 💙,Thursday,Email
01JWXJ7EKCF9YND84QHQBDBSAM,Pacific Driftwood Launch Reminder,2025-07-15,11:15 AM,0.68162,0.00472,0.00623,0.00236,6e-05,61147.0,46052.0,430,319,424,421,4.0,160.0,You've never smelled the coast like this,This new scent is making waves,Tuesday,Email
01JWRZAPP6GBYGFATBZP02VMT0,Pacific Driftwood Launch 2025 SMS,2025-07-11,11:47 AM,,0.13346,0.00633,,,,,287,274,13,13,,,,,Friday,SMS
01JWRVJ07TDF5YGFEJ05T892E8,Pacific Driftwood Launch 2025,2025-07-11,08:33 AM,0.50265,0.0057,0.00484,0.00544,0.00012,56252.0,42360.0,608,480,412,408,10.0,461.0,NEW: Pacific Driftwood 🌊,A new limited-edition scent that smells like the sea meeting the shore,Friday,Email
01JZTA82E2WDZ38Y63VTWB4XTN,Pacific Driftwood Early Release 2025 SMS (clone),2025-07-10,11:47 AM,,0.30055,0.01639,,,,,67,55,3,3,,,,,Thursday,SMS
01JZTA4V80EG37CHDDYXYP0WHJ,Pacific Driftwood Early Release 2025 (Re-send),2025-07-10,10:00 AM,0.72509,0.24399,0.0,0.00683,0.0,344.0,211.0,99,71,0,0,0.0,2.0,Your Exclusive Access is Here 🌊 🪵,"{{ first_name }}, be the first to experience this new scent",Thursday,Email
01JWXJJMCYPN78G9SVTHJ1QNRA,Pacific Driftwood Early Release 2025,2025-07-10,08:18 AM,1.0,1.0,0.0,0.0,0.0,2.0,1.0,1,1,0,0,0.0,0.0,Your Exclusive Access is Here 🌊 🪵,"{{ first_name }}, be the first to experience this new scent",Thursday,Email
01JWXJG50X76M7BAVSAMDCW8K1,Pacific Driftwood Sneak Peek,2025-07-08,11:47 AM,0.72813,0.00552,0.00549,0.00221,9e-05,63329.0,47646.0,519,361,364,359,6.0,145.0,A sneak peek at our new scent 🌊,Join the waitlist and get early access,Tuesday,Email
01JY26FQFMHB60H6Q2F2MQ8P8G,Classics Feature Summer 2025,2025-07-05,08:08 AM,0.72065,0.00288,0.00505,0.00202,5e-05,61760.0,47059.0,273,188,336,330,3.0,132.0,"Always in season, always in carts 🛒",Not just a one-spray stand,Saturday,Email
01JWXJD5MSJE5S880RWJD85SF3,Pacific Driftwood Waitlist Sign Up 2025,2025-07-03,08:18 AM,0.67895,0.00588,0.0049,0.00232,3e-05,62076.0,46799.0,526,405,343,338,2.0,160.0,A new scent is on the horizon ⛰️,Be first in line to try it,Thursday,Email
01JV80K4WJC03QMS2PFJ3KXZVH,Behind the Scent: Coastal Tide 2025,2025-07-01,12:45 PM,0.42837,0.0036,0.00569,0.00342,0.00015,26958.0,20112.0,310,169,271,267,7.0,161.0,The story behind our cleanest summer scent,A look at the plant-based process that brings this calming scent to life,Tuesday,Email
01JYQ3A5NBYVWBKC16ZYFKADNQ,[Follow-up] Blondewood Scent Feature (Engaged),2025-06-28,11:38 AM,0.22751,0.00529,0.00529,0.0,0.0,57.0,43.0,1,1,1,1,0.0,0.0,The vanilla that went viral.,"A fragrance so good, you’ll forget it’s non-toxic",Saturday,Email
01JY27B6JZZN6SFNE1E97XE3SN,Summer Favorite Winner 2025,2025-06-28,08:33 AM,0.64353,0.0136,0.00444,0.00281,0.00017,61776.0,46561.0,1208,984,323,321,12.0,204.0,This was a close one...😮,See which scent won the summer favorite,Saturday,Email
01JRDWYPMBD2X9P92VXC337Z3Q,Blondewood Scent Feature (Engaged),2025-06-26,11:38 AM,0.6922,0.00394,0.00394,0.00183,6e-05,60563.0,45633.0,323,260,261,260,4.0,121.0,Calling all vanilla lovers ✨,"A fragrance so good, you’ll forget it’s non-toxic",Thursday,Email
01JV7M19TQT3DR976K5V6H1FNG,Summer Reviews 2025,2025-06-24,07:47 PM,0.66618,0.00527,0.00368,0.00239,4e-05,64517.0,48307.0,591,382,269,267,3.0,174.0,Customer Favorites: Summer Edition ✨,We crunched the numbers (and read your reviews). These scents won summer.,Tuesday,Email
01JVD4SS00600GEQT9AWCCD0PV,1st day of Summer 2025,2025-06-20,11:12 AM,0.44,0.00489,0.00387,0.00349,0.00011,27859.0,20709.0,363,230,184,182,5.0,165.0,Your Guide to a Relaxing Summer 😌,You don’t need a big routine. Just small moments that make you feel good.,Friday,Email
01JV2SQHTZYMEMBK3PZDS583MV,Favorite Summer Poll 2025 Email,2025-06-18,11:11 AM,0.50673,0.00666,0.00338,0.00371,0.00019,21339.0,16215.0,279,213,108,108,6.0,119.0,Vote: What's Your Favorite Summer Scent?,Plus 4 natural ways to keep your car smelling fresh,Wednesday,Email
01JXWFCDSY19W8TMEMHRVVF4WV,Subscription Survey (4+ Orders 52 Weeks),2025-06-17,11:19 AM,0.60836,0.09598,0.00387,0.00077,0.0,1198.0,786.0,162,124,5,5,0.0,1.0,"Help Us Out & Get 15% Off, {{ person.first_name|title|default:'friend' }}!",Got 2 Minutes? 15% Off for Your Thoughts,Tuesday,Email
01JV2VQ9E5EDE35ECZK2NKBABA,Cabana Reviews 2025,2025-06-14,08:18 AM,0.60727,0.00411,0.00332,0.00298,8e-05,62509.0,47389.0,569,321,263,259,6.0,233.0,Our best summer scent yet? 🤔,You decide. The 5 star ratings are rolling in,Saturday,Email
01JWY7R1WBXD6GNPS1W379648E,Discovery Set Summer Travel Email 2025,2025-06-12,11:33 AM,0.70304,0.00381,0.00378,0.00202,5e-05,61108.0,46155.0,345,250,254,248,3.0,133.0,Going somewhere?,"For the road, the plane—or your everyday bag",Thursday,Email
01JSYQMV5ZG2TZTZAE64G9BG5V,Behind the Scent: Coconut Pineapple 2025,2025-06-10,02:12 PM,0.65823,0.00392,0.00333,0.00271,6e-05,64053.0,47799.0,437,285,247,242,4.0,197.0,What’s really inside Coconut Pineapple? 🍍,The unexpected way we made this scent smell like the perfect beach day,Tuesday,Email
01JX5VD5409E4X3VVGC3VZ7SVS,[Follow-up] Summer Car Fresheners 2025,2025-06-09,08:34 AM,0.27702,0.00632,0.00499,0.00041,0.0002,3479.0,2719.0,112,62,66,49,2.0,4.0,Add to car 🚗,Because clean should smell this good-even in your car,Monday,Email
01JSYYBCKGDJFD94ZAY5FB2TE0,Summer Car Fresheners 2025,2025-06-07,08:34 AM,0.5044,0.00451,0.00453,0.00254,0.0,27963.0,20818.0,685,186,201,187,0.0,105.0,"For road trips, beach days & everyday",Because clean should smell this good-even in your car,Saturday,Email
01JRZW7VWC5J2BYGRVXEN7FKE8,Summer Scent Quiz 2025,2025-06-05,01:00 AM,0.52961,0.00754,0.00525,0.00274,2e-05,30000.0,21979.0,514,313,220,218,1.0,114.0,Which summer scent are you? 🏖️,Coconut? Coastal? Discover which one is perfect for you,Thursday,Email
01JV7VWH88PGS4TGDE8M357ZA4,Coastal Tide Feature 2025,2025-06-03,07:17 PM,0.72003,0.00701,0.00433,0.00209,6e-05,65777.0,48759.0,918,475,303,293,4.0,142.0,The coastal scent you've been waiting for is back! 🌊,"""It makes my home smell like a beach house right off the ocean""",Tuesday,Email
01JT42NEWTTZSD31MJHYXA9P50,"Cabana Back in Stock, May 2025",2025-06-01,01:35 PM,0.69491,0.0048,0.00426,0.00247,3e-05,62461.0,46944.0,461,324,299,288,2.0,167.0,Back in Stock: Cabana 🌴,The summer scent that keeps selling out,Sunday,Email
01JT3TFG83WTXCATYJBMK0GDDG,Summer 3 Wick Candles 2025,2025-05-30,11:46 AM,0.51444,0.00407,0.00193,0.00214,0.0001,13517.0,9852.0,130,78,38,37,2.0,41.0,For when the day finally slows down,"{{ person.first_name|title|default:'friend' }}, you deserve a moment that feels still.",Friday,Email
01JV3046ETDGEJZEM9NS3TA853,Behind the Scent: Sea Salt Neroli 2025,2025-05-28,11:48 AM,0.43273,0.00576,0.00324,0.00292,0.00012,24822.0,18320.0,362,244,141,137,5.0,124.0,How We Captured the Coast in Full Bloom 🌺🌊,Smells like that just-back-from-the-beach feeling,Wednesday,Email
01JT3HMS3AZTYY4BKR1C7BEXBN,Sea Salt Neroli Archive Reminder 2025,2025-05-24,08:13 AM,0.61339,0.00834,0.00298,0.00166,7e-05,24416.0,18092.0,341,246,88,88,2.0,49.0,Did you hear what’s back?,One of our most-loved scents is here—for now.,Saturday,Email
01JT3GNFTBEDQCSB7CMF1E7PYD,Sea Salt Neroli Archive Event SMS 2025,2025-05-22,10:54 AM,,0.14441,0.00643,,,,,304,292,13,13,,,,,Thursday,SMS
01JT3EK2FYWJ71KPTFJ4NN9816,Sea Salt Neroli Archive Launch 2025,2025-05-22,08:11 AM,0.59551,0.01493,0.00291,0.00164,6e-05,25785.0,19222.0,654,482,94,94,2.0,53.0,Sea Salt Neroli is back 🏖️,You’ve been asking. The beach-day scent is here—but not for long.,Thursday,Email
01JT3PF1XVQCVW9TER2YJ70E9F,Sea Salt Neroli Archive Sneak Peek 2025,2025-05-20,12:11 PM,0.63202,0.00523,0.00304,0.00172,3e-05,24850.0,18737.0,213,155,93,90,1.0,51.0,Coming Soon... 🏖️,One of our most-loved summer scents is almost back,Tuesday,Email
01JT3XTWQY0JK2HQ89HFFFS2SA,Summer Daily Rituals 2025,2025-05-17,08:33 AM,0.52135,0.00713,0.00264,0.00218,9e-05,24133.0,18134.0,346,248,95,92,3.0,76.0,This is how we use our sprays every day,From morning resets to bedtime rituals—your daily scent guide starts here,Saturday,Email
01JSHH40370Y7R6NQ179R62RYH,Cabana Review Ask,2025-05-16,10:54 AM,0.8,0.0,0.0,0.0,0.0,5.0,4.0,0,0,0,0,0.0,0.0,"{{ person.first_name|title|default:'friend' }}, did you love Cabana?",Let us know what you think!,Friday,Email
01JVAN8WS32PVC2Q54E00BVYXY,Coconut Pineapple Scent Feature 2025 (3 months),2025-05-15,03:08 PM,0.61111,0.01762,0.00542,0.00806,0.0,637.0,451.0,116,13,4,4,0.0,6.0,The must-have scent of the season 🥥,Your favorite coconut scent is back,Thursday,Email
01JV2J661E27C32R1HE1FQDVJC,Coconut Pineapple Scent Feature 2025 (Less Engaged),2025-05-14,12:33 PM,0.17611,0.00359,0.00914,0.02056,0.00096,10912.0,8397.0,244,171,447,436,46.0,1001.0,The must-have scent of the season 🥥,Your favorite coconut scent is back,Wednesday,Email
01JRZZC3GXXV7904A0EB8N74YW,Coconut Pineapple Scent Feature 2025 (Engaged),2025-05-14,11:54 AM,0.65533,0.0065,0.00185,0.00145,0.0,25580.0,19445.0,244,193,55,55,0.0,43.0,The must-have scent of the season 🥥,Your favorite coconut scent is back,Wednesday,Email
01JV2GS7ZPY19P4A97GMJE2YA3,Last Call Spring Email 2025 (Spring Seasonal Purchasers),2025-05-13,08:08 AM,0.47084,0.00603,0.00342,0.00599,0.00033,3696.0,2890.0,54,37,21,21,2.0,37.0,Last Chance for Spring Scents 🌿,Grab your favorites while you can...,Tuesday,Email
01JTXTV9E6KJTQA4HVBMYCRB29,[Follow-up] Last Call Spring Email 2025,2025-05-12,08:18 AM,0.2942,0.00856,0.00262,0.00103,0.0,3031.0,2579.0,109,75,23,23,0.0,9.0,Low stock alert: Spring scents,Grab your favorites while you can...,Monday,Email
01JRZVC7H275WHCSESENM0D7ZY,Last Call Spring Email 2025,2025-05-10,08:18 AM,0.5103,0.00982,0.00193,0.00238,6e-05,22330.0,16889.0,485,325,64,64,2.0,79.0,Last Chance for Spring Scents 🌿,Grab your favorites while you can...,Saturday,Email
01JSYHKD84T18VZEA6E8TPVFYY,Behind the Scent: Cabana 2025,2025-05-08,11:47 AM,0.48782,0.00712,0.00259,0.00256,0.00011,23347.0,17679.0,354,258,96,94,4.0,93.0,How we bottled a vacation ☀️,Here’s how we created your next favorite scent,Thursday,Email
01JSYDP7A3ZAZC5MBV3KW2NEW9,Summer Discovery 2025,2025-05-06,12:12 PM,0.61925,0.00605,0.00225,0.00219,3e-05,53346.0,41240.0,553,403,152,150,2.0,146.0,Can’t pick one? Try them all.,Our Summer Discovery Set makes it easy,Tuesday,Email
01JT7199C7VEZQ6ZFEWZQ0K614,[Follow-up] Mother's Day Gift Guide 2025,2025-05-04,11:51 AM,0.24752,0.00833,0.00256,0.00043,0.0,2695.0,2318.0,100,78,24,24,0.0,4.0,Seriously Good Summer Sets for Gifting (or Keeping),"Whether it's for Mother’s Day, Teacher Appreciation, or just because...",Sunday,Email
01JT1S26ZGVW5GJXX12R3RMC92,[Follow-up] Cabana Scent Feature 2025,2025-05-03,10:54 AM,0.35345,0.00574,0.00235,0.00097,0.0,5127.0,4369.0,95,71,29,29,0.0,12.0,Smells like your next vacation ⛱️,The sun-soaked scent you've been waiting for,Saturday,Email
01JNRR22RBXTBCXH7Q4NN4BNZ5,Mother's Day Gift Guide 2025,2025-05-01,11:51 AM,0.50417,0.00698,0.00284,0.00208,8e-05,23586.0,17913.0,349,248,104,101,3.0,74.0,Gifts That Surprise + Delight 🌊,"Whether it's for Mother’s Day, Teacher Appreciation, or just because...",Thursday,Email
`,
    flow_data: `
Flow ID,Flow Name,Date,Message Channel,Status,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Clicks,Total Unsubscribes,Unique Unsubscribes,Spam Complaints,Bounces,Unique Clicks,Tags
X5uuBu,Abandoned Cart,May 01 2025 - May 31 2025,Email,Manual,0.59836,0.02777,0.00626,0.01426,0.0,2102,1530,82,16,16,0,37,71,Abandoned Cart
URuQQm,Bamboo Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.55844,0.05195,0.01299,0.0,0.0,54,43,8,1,1,0,0,4,
Sv2aV3,Blondewood Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.60465,0.02791,0.0,0.0,0.0,181,130,6,0,0,0,0,6,
Ra3i2j,Browse Abandonment,May 01 2025 - May 31 2025,Email,Manual,0.65812,0.0442,0.00494,0.00094,0.0,4073,2799,255,22,21,0,4,188,"Blondewood, Browse Abandonment"
UdjnAE,Golden Grove Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.58388,0.01809,0.00822,0.00328,0.00164,480,355,14,6,5,1,2,11,
VnsSZr,Lavender Blossom Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.66316,0.01053,0.0,0.0,0.0,90,63,2,0,0,0,0,1,
WVQkqP,Newsletter Signup,May 01 2025 - May 31 2025,Email,Manual,0.62181,0.02385,0.00341,0.01345,0.0,580,365,17,2,2,0,8,14,Newsletter
Ura52F,Pomelo Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Archived,0.59722,0.04167,0.0,0.0,0.0,77,43,5,0,0,0,0,3,
Sv3KEL,Post Purchase- 1st order,May 01 2025 - May 31 2025,Email,Live,0.57505,0.01067,0.00847,0.00354,0.00017,14094,10187,226,150,150,3,63,189,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,May 01 2025 - May 31 2025,Email,Live,0.58269,0.01186,0.00483,0.00197,0.0,3658,2653,96,22,22,0,9,54,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,May 01 2025 - May 31 2025,Email,Live,0.59825,0.01627,0.00334,0.00291,0.0,2020,1434,54,8,8,0,7,39,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,May 01 2025 - May 31 2025,Email,Live,0.66565,0.00608,0.00304,0.0,0.0,315,219,2,1,1,0,0,2,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,May 01 2025 - May 31 2025,Email,Live,0.68243,0.02703,0.0,0.0,0.0,155,101,5,0,0,0,0,4,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,May 01 2025 - May 31 2025,Email,Live,0.71115,0.00676,0.00169,0.0,0.0,663,421,5,1,1,0,0,4,Post Purchase
URwkiP,Product Review Ask,May 01 2025 - May 31 2025,Email,Live,0.56252,0.02002,0.00525,0.0036,0.00066,2381,1714,140,16,16,2,11,61,Review Ask
YiLWd4,Scent Quiz,May 01 2025 - May 31 2025,Email,Live,0.59685,0.02677,0.01701,0.01029,0.0,2721,1895,117,55,54,0,33,85,Scent Quiz
SnJkVA,Summer Waitlist SMS/Email,May 01 2025 - May 31 2025,Email,Archived,1.0,0.0,0.0,0.0,0.0,1,1,0,0,0,0,0,0,Waitlist
X7s2fe,Woodland Sage Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.60299,0.03284,0.01194,0.0,0.00299,278,202,16,4,4,1,0,11,
X5uuBu,Abandoned Cart,May 01 2025 - May 31 2025,Email,Manual,0.59836,0.02777,0.00626,0.01426,0.0,2102,1530,82,16,16,0,37,71,Abandoned Cart
URuQQm,Bamboo Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.55844,0.05195,0.01299,0.0,0.0,54,43,8,1,1,0,0,4,
Sv2aV3,Blondewood Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.60465,0.02791,0.0,0.0,0.0,181,130,6,0,0,0,0,6,
Ra3i2j,Browse Abandonment,May 01 2025 - May 31 2025,Email,Manual,0.65812,0.0442,0.00494,0.00094,0.0,4073,2799,255,22,21,0,4,188,"Blondewood, Browse Abandonment"
UdjnAE,Golden Grove Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.58388,0.01809,0.00822,0.00328,0.00164,480,355,14,6,5,1,2,11,
VnsSZr,Lavender Blossom Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.66316,0.01053,0.0,0.0,0.0,90,63,2,0,0,0,0,1,
WVQkqP,Newsletter Signup,May 01 2025 - May 31 2025,Email,Manual,0.62181,0.02385,0.00341,0.01345,0.0,580,365,17,2,2,0,8,14,Newsletter
Ura52F,Pomelo Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Archived,0.59722,0.04167,0.0,0.0,0.0,77,43,5,0,0,0,0,3,
Sv3KEL,Post Purchase- 1st order,May 01 2025 - May 31 2025,Email,Live,0.57505,0.01067,0.00847,0.00354,0.00017,14094,10187,226,150,150,3,63,189,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,May 01 2025 - May 31 2025,Email,Live,0.58269,0.01186,0.00483,0.00197,0.0,3658,2653,96,22,22,0,9,54,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,May 01 2025 - May 31 2025,Email,Live,0.59825,0.01627,0.00334,0.00291,0.0,2020,1434,54,8,8,0,7,39,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,May 01 2025 - May 31 2025,Email,Live,0.66565,0.00608,0.00304,0.0,0.0,315,219,2,1,1,0,0,2,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,May 01 2025 - May 31 2025,Email,Live,0.68243,0.02703,0.0,0.0,0.0,155,101,5,0,0,0,0,4,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,May 01 2025 - May 31 2025,Email,Live,0.71115,0.00676,0.00169,0.0,0.0,663,421,5,1,1,0,0,4,Post Purchase
URwkiP,Product Review Ask,May 01 2025 - May 31 2025,Email,Live,0.56252,0.02002,0.00525,0.0036,0.00066,2381,1714,140,16,16,2,11,61,Review Ask
YiLWd4,Scent Quiz,May 01 2025 - May 31 2025,Email,Live,0.59685,0.02677,0.01701,0.01029,0.0,2721,1895,117,55,54,0,33,85,Scent Quiz
SnJkVA,Summer Waitlist SMS/Email,May 01 2025 - May 31 2025,Email,Archived,1.0,0.0,0.0,0.0,0.0,1,1,0,0,0,0,0,0,Waitlist
X7s2fe,Woodland Sage Purchasers — Buy the Set!,May 01 2025 - May 31 2025,Email,Manual,0.60299,0.03284,0.01194,0.0,0.00299,278,202,16,4,4,1,0,11,
X5uuBu,Abandoned Cart,Jun 01 2025 - Jun 30 2025,Email,Manual,0.58233,0.03217,0.00864,0.01373,0.0,1866,1213,90,19,18,0,29,67,Abandoned Cart
URuQQm,Bamboo Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Manual,0.51471,0.05882,0.01471,0.0,0.0,49,35,7,1,1,0,0,4,
Sv2aV3,Blondewood Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Manual,0.55102,0.03401,0.0068,0.0,0.0,114,81,5,1,1,0,0,5,
Ra3i2j,Browse Abandonment,Jun 01 2025 - Jun 30 2025,Email,Manual,0.64482,0.0408,0.00529,0.00127,0.00063,4724,3050,309,25,25,3,6,193,"Blondewood, Browse Abandonment"
UdjnAE,Golden Grove Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Manual,0.59116,0.01105,0.00552,0.00549,0.0,318,214,4,2,2,0,2,4,
VnsSZr,Lavender Blossom Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Manual,0.57576,0.0303,0.01515,0.0,0.0,47,38,2,1,1,0,0,2,
WVQkqP,Newsletter Signup,Jun 01 2025 - Jun 30 2025,Email,Manual,0.50993,0.02815,0.00497,0.00165,0.0,520,308,27,3,3,0,1,17,Newsletter
Ura52F,Pomelo Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Archived,0.55556,0.11111,0.0,0.0,0.0,28,20,4,0,0,0,0,4,
Sv3KEL,Post Purchase- 1st order,Jun 01 2025 - Jun 30 2025,Email,Live,0.57634,0.01113,0.01022,0.00266,0.0002,13015,8856,236,159,157,3,41,171,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,Jun 01 2025 - Jun 30 2025,Email,Live,0.57044,0.01256,0.00628,0.0023,0.0,3888,2725,93,30,30,0,11,60,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,Jun 01 2025 - Jun 30 2025,Email,Live,0.58123,0.01998,0.00478,0.00303,0.00043,1878,1338,61,11,11,1,7,46,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,Jun 01 2025 - Jun 30 2025,Email,Live,0.64384,0.02192,0.0,0.0,0.0,343,235,8,0,0,0,0,8,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,Jun 01 2025 - Jun 30 2025,Email,Live,0.71304,0.02609,0.0,0.0,0.0,137,82,3,0,0,0,0,3,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,Jun 01 2025 - Jun 30 2025,Email,Live,0.72318,0.02361,0.00215,0.00214,0.0,577,337,14,1,1,0,1,11,Post Purchase
URwkiP,Product Review Ask,Jun 01 2025 - Jun 30 2025,Email,Live,0.57219,0.02502,0.00246,0.00286,0.00041,2023,1395,105,6,6,1,7,61,Review Ask
YiLWd4,Scent Quiz,Jun 01 2025 - Jun 30 2025,Email,Live,0.53795,0.02864,0.01814,0.0224,0.00095,1716,1127,80,38,38,2,48,60,Scent Quiz
X7s2fe,Woodland Sage Purchasers — Buy the Set!,Jun 01 2025 - Jun 30 2025,Email,Manual,0.57828,0.03535,0.00253,0.00252,0.0,350,229,14,1,1,0,1,14,
X5uuBu,Abandoned Cart,Jul 01 2025 - Jul 31 2025,Email,Manual,0.5978,0.0409,0.00891,0.00209,0.00052,1692,1140,148,18,17,1,4,78,Abandoned Cart
URuQQm,Bamboo Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Manual,0.54545,0.01818,0.0,0.0,0.0,49,30,1,0,0,0,0,1,
Sv2aV3,Blondewood Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Manual,0.60563,0.02817,0.01408,0.0,0.0,132,86,4,2,2,0,0,4,
Ra3i2j,Browse Abandonment,Jul 01 2025 - Jul 31 2025,Email,Manual,0.65116,0.04307,0.00665,0.00212,0.00027,3874,2449,292,25,25,1,8,162,"Blondewood, Browse Abandonment"
V24LBm,Customer Summer Waitlist SMS/Email,Jul 01 2025 - Jul 31 2025,Email,Archived,1.0,0.0,0.0,0.0,0.0,2,1,0,0,0,0,0,0,Waitlist
UdjnAE,Golden Grove Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Manual,0.58549,0.03109,0.00518,0.0,0.0,314,226,15,2,2,0,0,12,
VnsSZr,Lavender Blossom Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Manual,0.64912,0.05263,0.0,0.0,0.0,48,37,4,0,0,0,0,3,
WVQkqP,Newsletter Signup,Jul 01 2025 - Jul 31 2025,Email,Manual,0.45359,0.04028,0.00876,0.0,0.0,430,259,31,5,5,0,0,23,Newsletter
Ura52F,Pomelo Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Archived,0.6,0.04,0.0,0.0,0.0,41,30,2,0,0,0,0,2,
Sv3KEL,Post Purchase- 1st order,Jul 01 2025 - Jul 31 2025,Email,Live,0.56062,0.01164,0.01481,0.00226,0.00015,10857,7417,215,202,196,2,30,154,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,Jul 01 2025 - Jul 31 2025,Email,Live,0.56315,0.01419,0.0054,0.00358,0.0,4058,2818,117,27,27,0,18,71,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,Jul 01 2025 - Jul 31 2025,Email,Live,0.5847,0.02034,0.00487,0.00221,0.0,1807,1322,57,13,11,0,5,46,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,Jul 01 2025 - Jul 31 2025,Email,Live,0.64183,0.02006,0.0,0.0057,0.0,352,224,11,0,0,0,2,7,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,Jul 01 2025 - Jul 31 2025,Email,Live,0.68908,0.05882,0.0,0.0,0.0,123,82,10,0,0,0,0,7,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,Jul 01 2025 - Jul 31 2025,Email,Live,0.66145,0.01566,0.00196,0.0,0.0,569,338,10,1,1,0,0,8,Post Purchase
URwkiP,Product Review Ask,Jul 01 2025 - Jul 31 2025,Email,Live,0.56579,0.02726,0.01034,0.00234,0.0,1852,1204,87,22,22,0,5,58,Review Ask
YiLWd4,Scent Quiz,Jul 01 2025 - Jul 31 2025,Email,Live,0.56696,0.03622,0.02223,0.00951,0.0011,3157,2066,172,82,81,4,35,132,Scent Quiz
X7s2fe,Woodland Sage Purchasers — Buy the Set!,Jul 01 2025 - Jul 31 2025,Email,Manual,0.58199,0.03215,0.00322,0.0,0.0,266,181,14,1,1,0,0,10,
WZu49d,(RIQ) Welcome Flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.57309,0.06218,0.01839,0.00722,0.00066,6553,4332,696,143,139,5,55,470,Scent Quiz
X5uuBu,Abandoned Cart,Aug 01 2025 - Aug 31 2025,Email,Manual,0.60285,0.03191,0.01343,0.00584,0.0,1030,718,45,16,16,0,7,38,Abandoned Cart
URuQQm,Bamboo Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Manual,0.53846,0.07692,0.0,0.0,0.0,10,7,2,0,0,0,0,1,
Sv2aV3,Blondewood Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Manual,0.56522,0.04348,0.04348,0.0,0.0,17,13,1,1,1,0,0,1,
Ra3i2j,Browse Abandonment,Aug 01 2025 - Aug 31 2025,Email,Manual,0.67711,0.05463,0.00939,0.00174,0.0007,3005,1946,264,28,27,2,5,157,"Blondewood, Browse Abandonment"
UdjnAE,Golden Grove Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Manual,0.71739,0.02174,0.04348,0.0,0.0,48,33,1,2,2,0,0,1,
VnsSZr,Lavender Blossom Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Manual,0.88889,0.11111,0.0,0.0,0.0,10,8,2,0,0,0,0,1,
WVQkqP,Newsletter Signup,Aug 01 2025 - Aug 31 2025,Email,Manual,0.54286,0.0381,0.00952,0.00474,0.0,212,114,10,2,2,0,1,8,Newsletter
Ura52F,Pomelo Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Archived,0.7,0.2,0.0,0.0,0.0,9,7,2,0,0,0,0,2,
Sv3KEL,Post Purchase- 1st order,Aug 01 2025 - Aug 31 2025,Email,Live,0.59943,0.01193,0.01238,0.00268,0.00052,11658,8036,208,170,166,7,36,160,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,Aug 01 2025 - Aug 31 2025,Email,Live,0.60543,0.01554,0.00655,0.00261,0.00056,4783,3233,102,37,35,3,14,83,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,Aug 01 2025 - Aug 31 2025,Email,Live,0.5906,0.02527,0.00474,0.00276,0.0,2137,1496,80,12,12,0,7,64,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,Aug 01 2025 - Aug 31 2025,Email,Live,0.59453,0.01244,0.01244,0.00495,0.0,343,239,6,5,5,0,2,5,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,Aug 01 2025 - Aug 31 2025,Email,Live,0.72059,0.03922,0.01471,0.0,0.0,248,147,9,3,3,0,0,8,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,Aug 01 2025 - Aug 31 2025,Email,Live,0.70799,0.02265,0.00238,0.0,0.0,1006,594,30,2,2,0,0,19,Post Purchase
URwkiP,Product Review Ask,Aug 01 2025 - Aug 31 2025,Email,Live,0.5874,0.02714,0.00651,0.00217,0.0,1572,1082,129,12,12,0,4,50,Review Ask
YiLWd4,Scent Quiz,Aug 01 2025 - Aug 31 2025,Email,Live,0.53436,0.0227,0.02554,0.00751,0.00032,2526,1695,98,85,81,1,24,72,Scent Quiz
X7s2fe,Woodland Sage Purchasers — Buy the Set!,Aug 01 2025 - Aug 31 2025,Email,Manual,0.59722,0.01389,0.0,0.0,0.0,54,43,1,0,0,0,0,1,
XMz4Jh,[RIQ] Browse Flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.59675,0.03496,0.00742,0.00282,0.0,2583,1690,135,22,21,0,8,99,Abandoned Cart
RcJPaZ,[RIQ] Cart Flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.63616,0.04337,0.00882,0.00366,0.0,2711,1731,158,24,24,0,10,118,Abandoned Cart
Vb5mSm,[RIQ] Checkout Flow,Aug 01 2025 - Aug 31 2025,Email,Live,0.58227,0.03089,0.00873,0.00335,0.0,1445,867,61,13,13,0,5,46,Abandoned Cart
WZu49d,(RIQ) Welcome Flow,Sep 01 2025 - Sep 30 2025,Email,Live,0.51868,0.04788,0.01081,0.01078,0.00038,8385,5471,680,116,114,4,115,505,Scent Quiz
Sv3KEL,Post Purchase- 1st order,Sep 01 2025 - Sep 30 2025,Email,Live,0.61361,0.01228,0.00684,0.0051,0.00061,14594,10046,244,116,112,10,84,201,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,Sep 01 2025 - Sep 30 2025,Email,Live,0.61732,0.01495,0.00351,0.00533,0.0,4805,3344,103,19,19,0,29,81,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,Sep 01 2025 - Sep 30 2025,Email,Live,0.61211,0.02146,0.00345,0.00572,0.00038,2354,1597,88,9,9,1,15,56,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,Sep 01 2025 - Sep 30 2025,Email,Live,0.68,0.01714,0.0,0.00285,0.0,366,238,8,0,0,0,1,6,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,Sep 01 2025 - Sep 30 2025,Email,Live,0.77703,0.02703,0.0,0.00671,0.0,196,115,6,0,0,0,1,4,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,Sep 01 2025 - Sep 30 2025,Email,Live,0.69256,0.01294,0.00162,0.00323,0.0,688,428,8,1,1,0,2,8,Post Purchase
URwkiP,Product Review Ask,Sep 01 2025 - Sep 30 2025,Email,Live,0.57814,0.02172,0.00561,0.00627,0.0007,1172,825,52,8,8,1,9,31,Review Ask
YiLWd4,Scent Quiz,Sep 01 2025 - Sep 30 2025,Email,Live,0.51416,0.01636,0.00755,0.02095,0.0,1294,817,29,12,12,0,34,26,Scent Quiz
XMz4Jh,[RIQ] Browse Flow,Sep 01 2025 - Sep 30 2025,Email,Live,0.56664,0.04201,0.00536,0.0036,0.00037,7479,4545,497,43,43,3,29,337,Abandoned Cart
YuEYDm,[RIQ] Browse Flow - Triple Pixel,Sep 01 2025 - Sep 30 2025,Email,Live,0.57143,0.03907,0.00488,0.01444,0.0,681,468,48,4,4,0,12,32,
RcJPaZ,[RIQ] Cart Flow,Sep 01 2025 - Sep 30 2025,Email,Live,0.58435,0.03408,0.00343,0.00392,0.00017,5445,3412,247,20,20,1,23,199,Abandoned Cart
T4M5V3,[RIQ] Cart Flow - Triple Pixel,Sep 01 2025 - Sep 30 2025,Email,Live,0.58458,0.02355,0.00428,0.02505,0.0,447,273,13,2,2,0,12,11,
Vb5mSm,[RIQ] Checkout Flow,Sep 01 2025 - Sep 30 2025,Email,Live,0.59754,0.0355,0.01019,0.0028,0.00035,2582,1700,122,30,29,1,8,101,Abandoned Cart
S9Rg7H,[RIQ] Checkout Flow - Triple Pixel,Sep 01 2025 - Sep 30 2025,Email,Live,0.63862,0.02103,0.00765,0.00191,0.0,525,334,12,4,4,0,1,11,
WZu49d,(RIQ) Welcome Flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.52775,0.04613,0.00767,0.01345,0.00011,7148,4954,596,72,72,1,128,433,Scent Quiz
Sv3KEL,Post Purchase- 1st order,Oct 01 2025 - Oct 30 2025,Email,Live,0.59277,0.01183,0.00738,0.00483,0.00021,12578,8671,203,108,108,3,71,173,Post Purchase
RJm36M,Post Purchase- 2nd Order/Repeats,Oct 01 2025 - Oct 30 2025,Email,Live,0.5976,0.01912,0.00437,0.00561,0.0,4737,3282,135,24,24,0,31,105,Post Purchase
WhFsCF,Post Purchase- 3rd Order/Fans,Oct 01 2025 - Oct 30 2025,Email,Live,0.63366,0.02886,0.00178,0.00749,0.0,1963,1427,92,4,4,0,17,65,Post Purchase
SnMqew,Post Purchase- 4th Order/Fans,Oct 01 2025 - Oct 30 2025,Email,Live,0.60502,0.02194,0.0094,0.00623,0.0,267,193,7,3,3,0,2,7,Post Purchase
U3334r,Post Purchase- 5th Order/Superfans,Oct 01 2025 - Oct 30 2025,Email,Live,0.63462,0.01923,0.0,0.00952,0.0,104,66,3,0,0,0,1,2,Post Purchase
UctP9E,Post Purchase- 6+ Orders/Megafans,Oct 01 2025 - Oct 30 2025,Email,Live,0.70825,0.0096,0.00384,0.00192,0.0,591,369,7,2,2,0,1,5,Post Purchase
URwkiP,Product Review Ask,Oct 01 2025 - Oct 30 2025,Email,Live,0.59035,0.01801,0.00755,0.0052,0.0,1456,1016,48,13,13,0,9,31,Review Ask
YiLWd4,Scent Quiz,Oct 01 2025 - Oct 30 2025,Email,Live,0.51528,0.02213,0.00738,0.01454,0.0,686,489,28,7,7,0,14,21,Scent Quiz
XMz4Jh,[RIQ] Browse Flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.56172,0.03485,0.00473,0.00451,0.00039,4357,2853,287,24,24,2,23,177,Abandoned Cart
YuEYDm,[RIQ] Browse Flow - Triple Pixel,Oct 01 2025 - Oct 30 2025,Email,Live,0.5021,0.02521,0.0049,0.01108,0.0,1079,717,58,7,7,0,16,36,
RcJPaZ,[RIQ] Cart Flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.57552,0.0297,0.00379,0.00315,0.0,4333,2732,189,18,18,0,15,141,Abandoned Cart
T4M5V3,[RIQ] Cart Flow - Triple Pixel,Oct 01 2025 - Oct 30 2025,Email,Live,0.57931,0.02529,0.0,0.04396,0.0,384,252,14,0,0,0,20,11,
Vb5mSm,[RIQ] Checkout Flow,Oct 01 2025 - Oct 30 2025,Email,Live,0.53371,0.03045,0.00565,0.01118,0.0,1850,1227,92,13,13,0,26,70,Abandoned Cart
S9Rg7H,[RIQ] Checkout Flow - Triple Pixel,Oct 01 2025 - Oct 30 2025,Email,Live,0.56145,0.0207,0.00517,0.00643,0.0,612,434,21,4,4,0,5,16,
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
