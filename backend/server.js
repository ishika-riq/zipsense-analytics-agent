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
    products: [
      "Premium stainless steel bottles",
      "insulated tumblers",
      "coffee accessories",
      "growlers",
      "kids drinkware",
    ],
    tone: "Clean, purposeful, inspiring yet warm and authentic; balances minimalist sophistication with genuine impact storytelling",
    location: "United states",
    forms_data: `form_id,form_name,form_status,created_at,updated_at,closed_form,viewed_form,viewed_form_uniques,submits,submit_rate
SdXAFr,Email Subscribe Signup form - Web,live,2025-09-22T19:55:04+00:00,2025-09-22T19:55:04+00:00,0.0,5.0,2.0,0.0,0.0
W84UV7,RIQ: MIIR: Signup-New-(mobile/SMS),live,2025-07-28T12:42:30+00:00,2025-07-28T12:42:30+00:00,68756.0,84753.0,67014.0,3161.0,0.0373
UrTNaJ,RIQ: MIIR: Signup-New-(Desktop),live,2025-07-28T11:31:09+00:00,2025-07-28T11:31:09+00:00,28053.0,69554.0,50760.0,1110.0,0.01596
RsPaK5,DTC:  SMS opt in for email subscribers,live,2025-05-20T17:25:45+00:00,2025-05-20T17:25:45+00:00,5315.0,7064.0,5485.0,581.0,0.08225
Re7PCE,SMS | Post Purchase flow already subscribed message,live,2025-04-11T18:11:11+00:00,2025-04-11T18:11:11+00:00,0.0,16.0,5.0,6.0,0.375
UMC37k,SMS | https://miir.com/pages/sms-sign-up form,live,2025-02-24T20:40:42+00:00,2025-02-24T20:40:42+00:00,0.0,10.0,9.0,1.0,0.1
T76pjS,SMS | Cyber Monday Embed,draft,2024-11-27T23:41:39+00:00,2024-11-27T23:41:39+00:00,,,,,
WK23Es,12 Days of Drops Banner for blog 2,draft,2024-10-26T02:51:45+00:00,2024-10-26T02:51:45+00:00,,,,,
RAY3G2,Email & SMS Embed | 12 Days of Drops,draft,2024-10-16T16:32:31+00:00,2024-10-16T16:32:31+00:00,,,,,
V3aPhX,DTC: Multi-step email & SMS,draft,2024-09-26T14:39:45+00:00,2024-09-26T14:39:45+00:00,101222.0,347466.0,140407.0,4872.0,0.01402
SDJKRN,DTC Soft Goods Interest Pre Launch Embed,draft,2023-07-25T20:37:41+00:00,2023-07-25T20:37:41+00:00,,,,,
XHkemb,D2C Re-theme Footer Subscribe,live,2022-06-09T19:59:11+00:00,2022-06-09T19:59:11+00:00,0.0,144603.0,87001.0,333.0,0.0023
WJZPjV,Multi-step email & SMS,draft,2022-02-15T22:18:05+00:00,2022-02-15T22:18:05+00:00,,,,,
UbYHw3,Email PopUp (Nov 2021),draft,2021-10-28T14:41:39+00:00,2021-10-28T14:41:39+00:00,,,,,
T5fY7z,Email Re-subscribe Signup form,live,2020-11-11T18:21:10+00:00,2020-11-11T18:21:10+00:00,0.0,23.0,14.0,0.0,0.0
JMp6m3,MiiR.Com Footer Subscribe,live,2020-04-02T20:14:17+00:00,2020-04-02T20:14:17+00:00,,,,,
`,
    flow_messages_data: `message_id,message_name,created_at,updated_at,subject_line,preview_text
HYeKFa,Email After Purchase,2020-04-02T22:30:21+00:00,2020-05-22T01:32:21+00:00,We're So Grateful For Your Support!,A shipping update on your preordered Alone Together Camp Cup.
QuQQ36,Customer Winback: Email 1,2020-03-27T19:11:28+00:00,2021-01-29T05:26:03+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
NBMGbd,Customer Winback: Email 2,2020-03-27T19:11:28+00:00,2020-09-29T19:05:58+00:00,We've Missed You!,Explore customer favorites.
LqdwVL,Product Review / Cross Sell: Email 1,2020-03-27T19:11:29+00:00,2020-03-27T19:11:29+00:00,Don't keep it to yourself!,
KBkHzZ,Abandoned Cart: Email 3 (New),2020-03-27T19:11:27+00:00,2022-07-28T22:15:48+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
XtNj5t,Abandoned Cart: Email 4 (New),2020-04-23T00:12:01+00:00,2022-07-28T22:16:10+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
XvwvjL,Abandoned Cart: Email 1 (Returning),2020-11-16T21:03:29+00:00,2022-07-28T22:16:02+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
RpxxBv,Abandoned Cart: Email 8 (New),2020-11-16T21:39:24+00:00,2022-07-28T22:15:55+00:00,Right where you left off…,"Plus, a gift for you."
RVG5Rh,Abandoned Cart: Email 5 (New),2020-11-16T21:42:24+00:00,2022-07-28T22:16:24+00:00,Are you sure?,Just a few days left!
Xjduj9,Abandoned Cart: Email 2 (Returning),2020-11-16T22:03:32+00:00,2022-07-28T22:16:16+00:00,See What’s New,You’ll love these…
XrMf8v,Abandoned Cart: Email 6 (New),2020-11-20T04:05:11+00:00,2022-07-28T22:16:26+00:00,Last Chance!,Your gift ends tonight
XSV8iz,Abandoned Cart: Email 10 (New),2020-11-25T19:38:55+00:00,2022-07-28T22:16:20+00:00,Last Chance!,Your gift ends tonight...
R2xAt6,Abandoned Cart: Email 9 (New),2020-11-25T23:11:26+00:00,2022-07-28T22:16:06+00:00,Are you sure?,Just a few days left.
ShiDcU,AC SMS #1,2021-05-18T12:35:25+00:00,2021-05-18T12:38:49+00:00,,
Rtn5KT,AC SMS #2,2021-05-18T12:38:55+00:00,2021-05-18T12:40:13+00:00,,
VK3DF5,AC SMS #3,2021-05-18T12:40:23+00:00,2021-05-18T13:05:45+00:00,,
YaQdPP,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:47+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
QPSb77,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:42+00:00,2022-07-28T22:15:47+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
XhVqb2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:47+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
VXg4An,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:43+00:00,2022-07-28T22:15:48+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
XArrq5,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:48+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Y8PdFi,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:44+00:00,2022-07-28T22:15:48+00:00,You forgot this!,We saved your order...
Y4bXjU,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:44+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
YvWvfK,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:45+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Sr2xLh,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:45+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
R6mcbD,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation J",2022-07-28T22:15:45+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TraRXm,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation K",2022-07-28T22:15:46+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Wink2i,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation L",2022-07-28T22:15:46+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
YaQdPP,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:47+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
QPSb77,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:42+00:00,2022-07-28T22:15:47+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
XhVqb2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:47+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
VXg4An,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:43+00:00,2022-07-28T22:15:48+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
XArrq5,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:48+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Y8PdFi,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:44+00:00,2022-07-28T22:15:48+00:00,You forgot this!,We saved your order...
Y4bXjU,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:44+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
YvWvfK,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:45+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Sr2xLh,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:45+00:00,2022-07-28T22:15:49+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
R6mcbD,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation J",2022-07-28T22:15:45+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TraRXm,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation K",2022-07-28T22:15:46+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Wink2i,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation L",2022-07-28T22:15:46+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TTwDVy,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
WLJ7Yv,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
RebWLg,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Right where you left off…,"Plus, save an extra 10%."
UJqtrQ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Right where you left off…,"Plus, a gift for you."
U2LatP,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:56+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
S9H2BW,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
UpTs4g,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
XU7WHQ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:53+00:00,2022-07-28T22:15:57+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
TBBSJR,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:54+00:00,2022-07-28T22:15:57+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TTwDVy,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
WLJ7Yv,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
RebWLg,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Right where you left off…,"Plus, save an extra 10%."
UJqtrQ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Right where you left off…,"Plus, a gift for you."
U2LatP,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:56+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
S9H2BW,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
UpTs4g,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
XU7WHQ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:53+00:00,2022-07-28T22:15:57+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
TBBSJR,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:54+00:00,2022-07-28T22:15:57+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Wnb6hT,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Leave Something?,Welcome Back!
SGG4Vx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:58+00:00,2022-07-28T22:16:02+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
RZ3KXw,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:58+00:00,2022-07-28T22:16:02+00:00,Welcome Back!,Leave Something?
WEF7wW,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:59+00:00,2022-07-28T22:16:03+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
RcLcE7,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:59+00:00,2022-07-28T22:16:03+00:00,Did you forget this?,Welcome Back!
XKsG5q,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:59+00:00,2022-07-28T22:16:03+00:00,{{ first_name|default:'' }} — Welcome Back,Leave Something?
VSpydx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:00+00:00,2022-07-28T22:16:04+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back
ScUwRb,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:00+00:00,2022-07-28T22:16:04+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
QWSrBV,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:01+00:00,2022-07-28T22:16:04+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
WSxSqB,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation J",2022-07-28T22:16:01+00:00,2022-07-28T22:16:05+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
Wnb6hT,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Leave Something?,Welcome Back!
SGG4Vx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:58+00:00,2022-07-28T22:16:02+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
RZ3KXw,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:58+00:00,2022-07-28T22:16:02+00:00,Welcome Back!,Leave Something?
LMkNwd,New Customer Thank You: Email #1,2020-03-27T19:11:30+00:00,2020-03-27T19:11:30+00:00,You're what makes us great,
H3ewNt,Repeat Customer Thank You: Email #1,2020-03-27T19:11:30+00:00,2020-03-27T19:11:30+00:00,"Wow, thank you again!",
MJhCu4,Browse Abandon: Email #1,2020-03-27T19:11:26+00:00,2020-09-11T20:35:03+00:00,Take Another Peek,Our Thermo 3D™ double wall vacuum insulation keeps cold drinks chilled and hot drinks toasty.
VNhLfJ,Review email with code,2025-04-14T20:17:28+00:00,2025-08-19T18:11:10+00:00,Your $10 code link,Thanks for your MiiR review!
TwskFN,PDP Review #2 negative with code,2025-04-14T20:21:04+00:00,2025-08-19T18:11:20+00:00,We read your review...,
SzL2wP,SMS #1,2025-04-14T21:17:33+00:00,2025-08-30T13:04:25+00:00,,
SAWgnR,Q4 2024 QO | Abandoned Checkout (Aimerce) - Email #4.1,2025-07-29T20:38:01+00:00,2025-07-29T20:38:10+00:00,One step away...,Complete your order for impact.
UVKWaz,SMS #1,2025-07-29T20:38:02+00:00,2025-08-30T12:59:52+00:00,,
WJbPF4,Q4 2024 QO | Abandoned Checkout (Aimerce) - Email #3.2,2025-07-29T20:38:03+00:00,2025-07-29T20:38:10+00:00,Still deciding?,Take it from them — MiiR is worth it.
UR8FPb,Q4 2024 QO | Abandoned Checkout (Aimerce) - Email #2.3,2025-07-29T20:38:05+00:00,2025-07-29T20:38:10+00:00,Finish checkout,"And if you haven't already, use your code to save 15%!"
ULvrtM,Q4 2024 QO | Abandoned Checkout (Aimerce) - Email #1.4,2025-07-29T20:38:07+00:00,2025-07-29T20:38:10+00:00,Your checkout promo is expiring,Use it now!
VJQHNE,"Welcome Series, Email #1",2020-07-24T15:51:25+00:00,2022-07-28T22:16:04+00:00,Welcome to MiiR,"Thank you for joining us in our design forward, generosity driven mission!"
WEX3GG,"Welcome Series, Email #2",2020-07-24T15:51:26+00:00,2022-07-28T22:16:31+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
TNkPG7,"Welcome Series, Email #3",2020-07-24T15:51:26+00:00,2022-07-28T22:16:42+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
VbqbCr,"Welcome Series, Email #1 B",2021-02-17T04:04:07+00:00,2022-07-28T22:16:14+00:00,Welcome to MiiR,10% Off Your Next Purchase
S92XVS,"Welcome Series, Email #2 B",2021-02-20T21:19:57+00:00,2022-07-28T22:16:38+00:00,Add More Color To Your Life,Learn about our global impact
S2nXps,"Copy of Welcome Series, Email #2",2021-02-20T21:43:30+00:00,2022-07-28T22:16:17+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
T2xhAw,"Copy of Welcome Series, Email #3",2021-02-20T21:43:40+00:00,2022-07-28T22:16:35+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
RpXaPb,"Welcome Series, Email #3 B",2021-02-20T21:44:31+00:00,2022-07-28T22:17:02+00:00,Carbon Neutral Drinkware for Every Lifestyle,Products that give back
WjChbE,"Welcome Series, Email #4 B",2021-02-20T23:22:34+00:00,2022-07-28T22:17:23+00:00,"Podcasts, Blogs, and Recipes","Come to learn, leave inspired"
RaV7dj,"Welcome Series, Email #5 B",2021-02-22T03:10:39+00:00,2022-07-28T22:17:32+00:00,Last Chance for 20% Off,Offer ends in 24 hours
RdbsCt,"Copy of Welcome Series, Email #5 B 2",2021-03-08T21:13:18+00:00,2022-07-28T22:17:00+00:00,Last Chance for 20% Off,Offer ends in 24 hours
UifFz5,"Copy of Welcome Series, Email #5 B 1",2021-03-08T21:13:33+00:00,2022-07-28T22:17:06+00:00,Last Chance for 20% Off,Offer ends in 24 hours
XV6xSJ,"Welcome Series, Email #1 C",2021-05-14T03:16:19+00:00,2022-07-28T22:16:27+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
U7xvUi,"Welcome Series, SMS #1 | Aa",2021-05-14T03:19:34+00:00,2025-10-14T17:44:28+00:00,,
XUC3PQ,"Welcome Series, Email #2 C",2021-05-14T03:23:54+00:00,2022-07-28T22:16:57+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
Xmavtm,"Welcome Series, Email #3 C",2021-05-14T03:30:52+00:00,2022-07-28T22:17:13+00:00,Add More Color To Your Life,
RuGyTU,"Welcome Series, Email #4 C",2021-05-14T03:32:52+00:00,2022-07-28T22:17:30+00:00,This is why I started MiiR,
RezxQh,"Copy of Welcome Series, Email #2 B",2021-05-14T03:37:03+00:00,2022-07-28T22:16:32+00:00,Add More Color To Your Life,Learn about our global impact
WhkaYa,"Copy of Welcome Series, Email #1",2021-05-14T03:37:44+00:00,2022-07-28T22:15:53+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
XbcuDH,"Copy of Copy of Welcome Series, Email #3",2021-05-14T04:03:08+00:00,2022-07-28T22:16:50+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
UBFxUx,"Copy of Copy of Welcome Series, Email #5 B 1",2021-05-14T04:07:10+00:00,2022-07-28T22:17:21+00:00,Last Chance for 20% Off,Offer ends in 24 hours
Yc2HUx,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
QR4FbP,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Ready to make the world a better place?,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
WG6RD7,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation I",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,Welcome to MiiR,"Thank you for joining us in our design forward, generosity driven mission!"
Yc2HUx,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
QR4FbP,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Ready to make the world a better place?,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
R2Tr6b,Abandoned Cart [Email #1],2025-01-28T16:10:48+00:00,2025-01-30T16:58:37+00:00,Forgetting something?,Complete your order and support nonprofits with every sip.
Th5Qwv,Abandoned Cart [Email #2],2025-01-28T16:10:50+00:00,2025-06-24T12:08:27+00:00,Still deciding?,Check out our glowing reviews ⭐⭐⭐⭐⭐
UYFyLQ,Abandoned Cart [Email #4],2025-01-30T16:34:35+00:00,2025-06-24T12:08:49+00:00,Your 10% off expires today⌛,Lock in your discount now before it's too late.
XgSuEq,SMS #1,2025-02-06T18:14:36+00:00,2025-08-30T13:07:13+00:00,,
Rf64ka,Copy of Abandoned Cart [Email #3] NO Discount | Free Shipping Over $75 Reminder,2025-02-13T21:46:16+00:00,2025-06-24T12:08:44+00:00,Your cart is waiting,"We'll hold it for you, but your cart is getting pretty lonely."
RFU65b,Copy of Abandoned Cart [Email #3] 10% Discount,2025-02-13T22:16:34+00:00,2025-06-24T12:08:39+00:00,Your cart deserves a little treat,10% code expires in 48 hours.
YqjQbD,Abandoned Cart [Email #3] Welcome Discount Reminder,2025-02-13T22:24:03+00:00,2025-06-24T12:08:33+00:00,Your cart is waiting—and so is your discount,Snag your favorites before they sell out.
X5gZbf,GiveCode Email #1,2022-03-02T22:28:06+00:00,2022-07-28T22:15:52+00:00,Welcome To Our Give Code™ Community!,"Get To Know Our Nonprofit Partner, Ecotrust"
Uuzymm,GiveCode Email #2,2022-03-02T22:28:08+00:00,2022-07-28T22:16:13+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
TrL7ZH,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Welcome To Our Give Code™ Community!,"Get To Know Our Nonprofit Partner, Ecotrust"
Y7ptz9,"GiveCode Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,"Get To Know Our Nonprofit Partner, Ecotrust",Welcome To Our Give Code™ Community!
VwG2Kf,"GiveCode Email #1 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:53+00:00,Thank You For Registering Your Give Code™,"Welcome to the community! Learn more about our featured nonprofit partner, Ecotrust"
TrL7ZH,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Welcome To Our Give Code™ Community!,"Get To Know Our Nonprofit Partner, Ecotrust"
Y7ptz9,"GiveCode Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,"Get To Know Our Nonprofit Partner, Ecotrust",Welcome To Our Give Code™ Community!
VwG2Kf,"GiveCode Email #1 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:53+00:00,Thank You For Registering Your Give Code™,"Welcome to the community! Learn more about our featured nonprofit partner, Ecotrust"
WDfmqM,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:16:10+00:00,2022-07-28T22:16:12+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Vpdgbx,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:16:10+00:00,2022-07-28T22:16:13+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
VizZQ9,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
TrwRYg,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
WVKnDQ,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:12+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
V4GeMX,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
WDfmqM,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:16:10+00:00,2022-07-28T22:16:12+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Vpdgbx,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:16:10+00:00,2022-07-28T22:16:13+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
VizZQ9,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
TrwRYg,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
WVKnDQ,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:12+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
V4GeMX,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
WDtHnd,SMS #1,2025-08-11T16:54:41+00:00,2025-08-11T16:57:52+00:00,,
TapVbX,(Repeat purchaser) Drive repurchase with SMS discount,2025-08-07T21:15:59+00:00,2025-08-07T21:50:04+00:00,,
UWPNGs,Copy of (Repeat purchaser) Drive repurchase with Give info,2025-08-07T21:16:01+00:00,2025-08-07T21:16:01+00:00,Important info about your purchase.,Learn how you were part of $5M in giving!
W8eDAi,(Repeat purchaser) Drive repurchase with Give info,2025-08-07T21:16:03+00:00,2025-08-07T21:16:03+00:00,Important info about your purchase.,Learn how you were part of $5M in giving!
WECrRx,(1x purchaser) Re-engagement focus,2025-08-07T21:16:05+00:00,2025-08-07T21:16:05+00:00,Find your perfect color.,"Sagebrush, Thousand Hills, Tidal Blue..."
RcHwYG,Copy of (Repeat purchaser) Drive repurchase with Give info,2025-08-07T21:16:07+00:00,2025-08-07T21:16:07+00:00,Important info about your purchase.,Learn how you were part of $5M in giving!
Vs8QHU,Retention - 10% off + July 2025 Impact note,2025-08-07T21:20:58+00:00,2025-08-07T21:39:58+00:00,A note from Bryan Papé,
WvXF85,Copy of Retention - 10% off + July 2025 Impact note,2025-08-07T21:45:14+00:00,2025-08-07T21:45:22+00:00,A note from Bryan Papé,
UWwcFf,GiveCode email 1,2025-09-25T18:13:07+00:00,2025-09-25T18:18:32+00:00,One last step to complete registration.,
T5nnSa,Email #1: New collection spotlight,2025-09-13T17:46:42+00:00,2025-09-19T08:27:59+00:00,Have you checked our new collections?,Fresh releases crafted to stand out.
RrnvYE,Email #2: Coffee Buyers → Hydration,2025-09-13T17:50:29+00:00,2025-09-24T21:03:44+00:00,The perfect partner to your coffee ritual,Check out our hydration essentials.
R62Yxh,Email #2: Hydration Buyer → Coffee,2025-09-13T17:54:16+00:00,2025-09-24T20:48:32+00:00,Coffee that travels as well as you do ☕,Explore core coffee essentials.
R3ZYnL,Email #2: Fallback cross-sell,2025-09-13T17:54:54+00:00,2025-09-19T10:34:25+00:00,"Fuel your day, the MiiR way","From brew to bottle, MiiR essentials that look good and perform even better."
SLZ7Cz,Email: Price drop collection highlight,2025-09-13T17:58:10+00:00,2025-09-24T20:44:29+00:00,Big savings on quality gear.,"Snag best-sellers at rare markdowns, before they sell out."
Yk8wTa,Email: Personalization Upsell,2025-09-13T17:59:40+00:00,2025-09-24T20:48:00+00:00,"Your MiiR, your way",Engrave it. Gift it. Personalize it. 
Tw4g7Z,Email: Price drop collection highlight,2025-09-24T10:07:34+00:00,2025-09-24T21:04:03+00:00,Big savings on MiiR gear!,Snag best-sellers at rare markdowns before they sell out.
Xc8xwH,Email: Personalization Upsell,2025-09-24T10:08:07+00:00,2025-09-24T21:04:26+00:00,"Your MiiR, your way",Engrave it. Gift it. Personalize it. 
XsByBf,Email: Price drop collection highlight,2025-09-24T10:08:30+00:00,2025-09-24T10:08:40+00:00,Big Savings on MiiR Gear,"Snag best-sellers at rare markdowns, before they sell out."
Wt4usx,Email: Personalization Upsell,2025-09-24T10:08:58+00:00,2025-09-24T10:09:25+00:00,"Your MiiR, your way","Engrave it. Gift it. Personalize it. Your drinkware, your way."
UXHSdt,Email: Price drop collection highlight,2025-09-24T10:09:35+00:00,2025-09-24T10:09:51+00:00,Big Savings on MiiR Gear,"Snag best-sellers at rare markdowns, before they sell out."
TYaN4K,Email: Personalization Upsell,2025-09-24T10:09:58+00:00,2025-09-24T10:10:12+00:00,"Your MiiR, your way","Engrave it. Gift it. Personalize it. Your drinkware, your way."
WtXPTr,SMS #1,2025-09-29T13:23:18+00:00,2025-09-29T13:24:42+00:00,,
VU9LP2,Copy of SMS #1,2025-10-09T18:09:34+00:00,2025-10-09T18:09:34+00:00,,
Y777cM,Email #1: Brand/Generosity,2024-12-13T22:09:54+00:00,2025-03-07T21:32:26+00:00,One step away...,Complete your order for impact.
VTwVXk,Email #2: Reviews/social proof,2024-12-13T22:10:10+00:00,2025-06-24T12:09:45+00:00,Still deciding?,Take it from them — MiiR is worth it.
XB4sbV,Abandoned Checkout - Email #3: Discount,2024-12-16T20:02:19+00:00,2025-06-24T12:09:50+00:00,Finish checkout,"And if you haven't already, use your code to save 15%!"
U8JVxR,Email #4,2024-12-16T20:35:09+00:00,2025-06-24T12:09:59+00:00,Your checkout promo is expiring,Use it now!
Wzavcs,SMS #1,2025-02-19T23:43:54+00:00,2025-08-30T13:02:11+00:00,,
WVpG2F,Post-Purchase Email #1A,2025-02-24T20:50:22+00:00,2025-02-24T20:50:22+00:00,You’re in the Family Now,Tips for your MiiR drinkware
RtuM9Q,Post-Purchase Email #1B,2025-02-24T20:50:23+00:00,2025-02-24T20:50:23+00:00,You’re in the Family Now,Tips for your MiiR drinkware
Urjvyb,Post-Purchase Email #2,2025-02-24T20:50:24+00:00,2025-02-24T20:50:24+00:00,Eyeing more MiiR?,Sustainably sip morning through happy hour
TUqvsq,Post-Purchase Email #1,2021-05-18T14:57:57+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
SF2jXX,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation A",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
TQraRP,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation B",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
Tdq8fc,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation C",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
WNfTga,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation D",2022-08-25T23:48:26+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
SF2jXX,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation A",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
TQraRP,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation B",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
Tdq8fc,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation C",2022-08-25T23:48:25+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
WNfTga,"Post-Purchase Email #1 Test #1 August 25, 2022 Variation D",2022-08-25T23:48:26+00:00,2022-08-25T23:48:26+00:00,You’re in the Family Now,Tips for your MiiR drinkware
XHyh3W,SMS #1,2025-09-12T18:40:44+00:00,2025-09-27T07:34:53+00:00,,
UZuPDN,SMS - 0.C-Email #2,2025-09-12T18:46:31+00:00,2025-10-15T17:43:32+00:00,Still deciding?,Learn more about innovation x purpose.
UGaikW,SMS-N.C-Email #2,2025-09-12T18:47:40+00:00,2025-10-15T17:43:18+00:00,Still deciding?,Learn more about innovation x purpose.
TcPG7S,SMS-N.C- Email #3,2025-09-12T18:48:13+00:00,2025-10-15T17:46:09+00:00,10% off MiiR essentials.,Join our global community before it expires.
R36hAf,SMS Email #1,2025-09-27T00:10:27+00:00,2025-10-15T17:40:42+00:00,Essentials That Do More,From coffee rituals to daily hydration.
TH3Hjk,Non-SMS- Email #1,2025-09-27T17:20:12+00:00,2025-10-15T17:31:38+00:00,Essentials That Do More,From coffee rituals to daily hydration.
TiuFCJ,SMS-O.C- Email #3,2025-09-27T17:21:46+00:00,2025-09-28T06:37:57+00:00,Join Thousands Who Love MiiR,"See why our community trusts MiiR for Coffee, hydration, and daily essentials."
UiavLU,Non- SMS-O.C-Email#2,2025-09-27T17:33:18+00:00,2025-10-15T17:35:25+00:00,Still deciding?,Learn more about innovation x purpose.
XWdM37,Non- SMS-O.C-Email#3,2025-09-27T17:35:03+00:00,2025-10-15T17:38:37+00:00,"Over 250,000 and counting.",See why global communities trust MiiR.
WNVuWf,Welcome Email #1: Main List,2024-11-18T16:40:27+00:00,2025-02-13T21:21:47+00:00,Welcome to MiiR!,Your 15% discount awaits 🎉
TLtwcw,Welcome Email #2: Responsibility,2024-11-18T16:40:28+00:00,2025-05-27T15:24:22+00:00,Drink responsibly,Here's how you are part of the movement. 
WziR4g,Welcome Email #3: Product Features/Design,2024-11-22T14:23:05+00:00,2025-05-27T15:24:27+00:00,You did it!,Discover the MiiR philosophy that drives everything we do.
V5VJ4V,Welcome Email #4: GiveCode,2024-11-22T16:28:42+00:00,2025-05-27T15:24:31+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
V2QjbT,Welcome Email #3: Promo Code Reminder + Product Features/Design,2024-12-03T18:21:46+00:00,2025-05-27T15:24:54+00:00,Basics but...innovative.,Save 15% on your first experience.
V7f5nh,Welcome Email #4: Generosity,2024-12-03T19:00:06+00:00,2025-05-27T15:24:41+00:00,We not me,How you can be part of the GiveCode
WCUibG,Welcome Email #4: GiveCode,2025-04-10T21:06:12+00:00,2025-05-27T15:24:36+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
UzqgDu,Browse Abandonment: winning variation,2020-11-24T04:53:30+00:00,2025-04-28T19:18:43+00:00,{{ first_name|default:'' }} — Did you forget this?,Return where you left off.
WhcTNz,Browse Abandonment: email 2,2020-11-24T04:53:31+00:00,2025-06-24T11:57:49+00:00,Your Give Code™ journey awaits.,Head back to start.
SJ7P3G,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Leave Something?,Welcome Back!
TbSkXx,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
UTEY8C,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Welcome Back!,Leave Something?
RLzK3v,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
XGfbQb,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Did you forget this?,Welcome Back!
VcaZmF,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
UuwGpE,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,Did you forget this?,Welcome Back
WJH7PY,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
YsvJZ5,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:54+00:00,2022-07-28T22:15:57+00:00,{{ first_name|default:'' }} — Like This?,Welcome Back!
SJ7P3G,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Leave Something?,Welcome Back!
TbSkXx,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
UTEY8C,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Welcome Back!,Leave Something?
RLzK3v,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
XGfbQb,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:52+00:00,2022-07-28T22:15:55+00:00,Did you forget this?,Welcome Back!
VcaZmF,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
UuwGpE,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,Did you forget this?,Welcome Back
WJH7PY,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:15:53+00:00,2022-07-28T22:15:56+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
YsvJZ5,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:15:54+00:00,2022-07-28T22:15:57+00:00,{{ first_name|default:'' }} — Like This?,Welcome Back!
RUZKEu,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:06+00:00,2025-06-24T11:57:48+00:00,See What’s New,You’ll love these…
W4fiWF,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:07+00:00,2025-06-24T11:57:49+00:00,See What’s New,You’ll love these!
SnLhAj,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:07+00:00,2025-06-24T11:57:49+00:00,See What’s New,You’ll love these…
RUZKEu,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:06+00:00,2025-06-24T11:57:48+00:00,See What’s New,You’ll love these…
W4fiWF,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:07+00:00,2025-06-24T11:57:49+00:00,See What’s New,You’ll love these!
SnLhAj,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:07+00:00,2025-06-24T11:57:49+00:00,See What’s New,You’ll love these…
SfCcvU,Order Confirmation - Email,2025-09-09T23:19:01+00:00,2025-09-09T23:19:03+00:00,Order Confirmed,Thank you for your purchase!
ULKxvP,GiveCode Email #1,2021-06-07T20:55:09+00:00,2022-07-28T22:15:53+00:00,"Get To Know Our Nonprofit Partner, Bike Works",Welcome to our Give Code™ community! Explore Project #72 with Bike Works
Vew5rE,GiveCode Email #2,2021-06-07T20:55:11+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
X2BT2F,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,"Get To Know Our Nonprofit Partner, Bike Works",Welcome to our Give Code™ community! Explore Project #72 with Bike Works
V4VuPq,"GiveCode Email #1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Thank you for registering your Give Code™,"Welcome to the community! Learn more about our newest nonprofit partner, Bike Works."
UgDVvZ,"GiveCode Email #1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
X2BT2F,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,"Get To Know Our Nonprofit Partner, Bike Works",Welcome to our Give Code™ community! Explore Project #72 with Bike Works
V4VuPq,"GiveCode Email #1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Thank you for registering your Give Code™,"Welcome to the community! Learn more about our newest nonprofit partner, Bike Works."
UgDVvZ,"GiveCode Email #1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
R25VRa,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
SHSz2f,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
RpddrB,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
T6ZQAG,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
XefpST,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
XLDca8,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
R25VRa,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:16:11+00:00,2022-07-28T22:16:14+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
SHSz2f,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
RpddrB,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:16:12+00:00,2022-07-28T22:16:15+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
T6ZQAG,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
XefpST,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
XLDca8,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:13+00:00,2022-07-28T22:16:16+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
WAM3WF,Post-Purchase Email #1A,2025-04-10T21:30:54+00:00,2025-04-10T22:57:59+00:00,You're officially part of MiiR,"Thanks to you, we can do a lot. "
U6GRub,Post-Purchase Email #1B,2025-04-10T21:30:56+00:00,2025-04-10T22:39:43+00:00,Glad to have you back!,Thank you from MiiR.
WrwxfT,Post-Purchase Email #2B,2025-04-10T21:30:58+00:00,2025-05-14T07:28:22+00:00,Your MiiR story has begun 🌱,Care FAQ and registration details.
WXUjx8,Post-Purchase Email #3B,2025-04-10T21:30:59+00:00,2025-04-14T20:41:29+00:00,Join the MiiR debate!, Leave a review and earn $10.
VkaGuZ,Post-Purchase Email #1B Variation A text only,2025-04-10T22:34:17+00:00,2025-04-10T22:39:43+00:00,Glad to have you back!,
TZvkUm,Post-Purchase Email #1B Variation B images,2025-04-10T22:34:19+00:00,2025-04-10T22:39:43+00:00,Glad to have you back!,Here's some helpful resources.
VkaGuZ,Post-Purchase Email #1B Variation A text only,2025-04-10T22:34:17+00:00,2025-04-10T22:39:43+00:00,Glad to have you back!,
TZvkUm,Post-Purchase Email #1B Variation B images,2025-04-10T22:34:19+00:00,2025-04-10T22:39:43+00:00,Glad to have you back!,Here's some helpful resources.
XtQ7jQ,Post-Purchase Email #2B,2025-04-10T23:20:33+00:00,2025-05-14T07:28:17+00:00,Did you flip it yet?,Register your new MiiR.
Tc43nF,Copy of Post-Purchase Email #3B,2025-04-10T23:30:37+00:00,2025-04-10T23:30:37+00:00,Love Your MiiR? Let Us Know & Get Rewarded, Earn $10 toward your next purchase!
QQZ9ux,SMS | post purchase - review request V1,2025-04-14T20:29:04+00:00,2025-06-24T12:16:18+00:00,,
XurTcb,SMS | post purchase - review request V2,2025-04-14T20:46:20+00:00,2025-06-24T12:16:21+00:00,,
UApmgV,Email #1 - cross sell,2025-07-30T14:19:32+00:00,2025-08-13T18:22:50+00:00,A MiiR match!,"Based on what you love, we recommend this..."
RPATGs,SMS #1 - cross sell,2025-07-30T14:20:31+00:00,2025-08-13T19:31:37+00:00,,
VWk2HY,Abandoned Cart: Email 1 (Returning),2021-02-24T21:11:14+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TYDCwH,Abandoned Cart: Email 2 (Returning),2021-02-24T21:11:16+00:00,2022-07-28T22:15:55+00:00,See What’s New,You’ll love these…
RPstsG,SMS #1,2021-02-24T21:13:12+00:00,2021-02-24T21:18:41+00:00,,
S55Lgy,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:53+00:00,2022-07-28T22:15:54+00:00,See What’s New,You’ll love these…
SwQicp,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:53+00:00,2022-07-28T22:15:55+00:00,See What’s New,You’ll love these!
XPuGns,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:54+00:00,2022-07-28T22:15:55+00:00,See What’s New,You’ll love these…
RJyJSY,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:54+00:00,2022-07-28T22:15:56+00:00,See What’s New,You’ll love these!
S55Lgy,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:53+00:00,2022-07-28T22:15:54+00:00,See What’s New,You’ll love these…
SwQicp,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:53+00:00,2022-07-28T22:15:55+00:00,See What’s New,You’ll love these!
XPuGns,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:54+00:00,2022-07-28T22:15:55+00:00,See What’s New,You’ll love these…
RJyJSY,"Abandoned Cart: Email 2 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:54+00:00,2022-07-28T22:15:56+00:00,See What’s New,You’ll love these!
Y5Jtrx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:24+00:00,2022-07-28T22:16:26+00:00,Leave Something?,Welcome Back!
QPpF4d,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:24+00:00,2022-07-28T22:16:26+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TMepsy,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:24+00:00,2022-07-28T22:16:27+00:00,Welcome Back!,Leave Something?
YxuZmn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:24+00:00,2022-07-28T22:16:27+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
XUtWJK,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:25+00:00,2022-07-28T22:16:27+00:00,Did you forget this?,Welcome Back!
URZXZ2,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:25+00:00,2022-07-28T22:16:27+00:00,{{ first_name|default:'' }} — Welcome Back,Leave Something?
W3qNSS,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:25+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back
RcwWCE,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:25+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
YneuEA,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:26+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TxkCqn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation J",2022-07-28T22:16:26+00:00,2022-07-28T22:16:29+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
Y5Jtrx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:24+00:00,2022-07-28T22:16:26+00:00,Leave Something?,Welcome Back!
QPpF4d,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:24+00:00,2022-07-28T22:16:26+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TMepsy,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:24+00:00,2022-07-28T22:16:27+00:00,Welcome Back!,Leave Something?
YxuZmn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:24+00:00,2022-07-28T22:16:27+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
XUtWJK,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:25+00:00,2022-07-28T22:16:27+00:00,Did you forget this?,Welcome Back!
URZXZ2,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:25+00:00,2022-07-28T22:16:27+00:00,{{ first_name|default:'' }} — Welcome Back,Leave Something?
W3qNSS,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:25+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back
RcwWCE,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:25+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
YneuEA,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:26+00:00,2022-07-28T22:16:28+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TxkCqn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation J",2022-07-28T22:16:26+00:00,2022-07-28T22:16:29+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
WzeTwP,Email #1,2025-09-13T17:38:20+00:00,2025-09-15T08:49:29+00:00,Thank You for Choosing Purposeful Design ✨,"We’re preparing your order, and your impact is already underway."
XuKXnv,Email #2,2025-09-13T17:39:03+00:00,2025-09-15T08:49:48+00:00,Your Feedback Matters to Us!,"Tell us, how’s the journey going with your MiiR gear?"
XGYKTU,KL Test,2025-09-24T18:45:25+00:00,2025-09-24T18:45:31+00:00,Thank You for Choosing Purposeful Design ✨,"We’re preparing your order, and your impact is already underway."
VZWg2w,"Welcome Series, Email #1",2021-10-15T16:50:57+00:00,2021-10-15T16:50:57+00:00,Thanks for signing up!,
VnVdpT,"Welcome Series, Email #2",2021-10-15T16:50:57+00:00,2021-10-15T16:50:57+00:00,Follow us on Social Media!,
SXuhgM,"Welcome Series, Email #3",2021-10-15T16:50:57+00:00,2021-10-15T16:50:57+00:00,Check out our best-sellers.,
Vqbctv,Abandoned Cart: Email 1,2020-09-29T20:39:08+00:00,2020-09-29T20:39:08+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
RcinPU,$75 Value Abandoned Cart: Email 2,2020-09-29T20:39:08+00:00,2020-09-29T23:20:30+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 20%. And! We made it easy to return to where you left off."
RvpE7j,< $75 Abandoned Cart: Email 2,2020-09-29T20:40:49+00:00,2020-09-29T21:00:53+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
RkxG4w,Email #1,2025-08-22T12:53:33+00:00,2025-08-22T12:53:33+00:00,Email #1 Subject,
UbvtrP,Welcome Email #2: Responsibility,2025-05-22T07:47:55+00:00,2025-05-22T07:47:55+00:00,Drink responsibly,Here's how you are part of the movement. 
SisjzW,Welcome Email #3: Product Features/Design,2025-05-22T07:47:57+00:00,2025-05-22T07:47:57+00:00,You did it!,Discover the MiiR philosophy that drives everything we do.
WY5F9n,Welcome Email #4: GiveCode,2025-05-22T07:47:59+00:00,2025-05-22T07:47:59+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
UtZuES,Welcome Email #3: Promo Code Reminder + Product Features/Design,2025-05-22T07:48:01+00:00,2025-05-22T07:48:01+00:00,Basics but...innovative.,Save 15% on your first experience.
QNwtiw,Welcome Email #4: GiveCode,2025-05-22T07:48:02+00:00,2025-05-22T07:48:02+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
WJbU7c,Welcome Email #4: Generosity,2025-05-22T07:48:04+00:00,2025-05-22T07:48:04+00:00,We not me,How you can be part of the GiveCode
VZ7R32,Email #8,2025-05-22T07:49:03+00:00,2025-05-22T11:58:20+00:00,Thanks for Entering with Edible Communities — Here’s 15% Off MiiR,
VswWRw,Customer Winback: Email 1,2020-09-29T19:32:08+00:00,2022-07-28T22:15:49+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
ReE9dV,Customer Winback: Email 2,2020-09-29T19:32:09+00:00,2022-07-28T22:15:57+00:00,Save 10% when you shop,Explore new releases and customer favorites all while saving 10% on your next purchase.
TWdH6c,Customer Winback: Email 3,2021-01-29T05:29:18+00:00,2022-07-28T22:15:45+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
VMfQMy,Customer Winback: Email 4,2021-01-29T05:29:52+00:00,2022-07-28T22:15:53+00:00,Save 10% when you shop!,Explore new releases and customer favorites all while saving 10% on your next purchase.
U3AExC,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
UqHW85,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
XQjcsf,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
TZzEp7,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
U3AExC,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
UqHW85,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
XQjcsf,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
TZzEp7,"Customer Winback: Email 3 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
WL8RW9,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
XQUsuB,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
YiEYqs,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
RAHYim,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
WL8RW9,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
XQUsuB,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
YiEYqs,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
RAHYim,"Customer Winback: Email 1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,It's been a while,We thought we'd check in and say hi to share what's new!
TY9UgW,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Save 10% when you shop!,Explore new releases and customer favorites all while saving 10% on your next purchase.
Y2LddK,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Save 10% when you shop,Explore new releases and customer favorites all while saving 10% on your next purchase.
TDCSTn,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,We've Missed You!,Explore customer favorites.
TY9UgW,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:51+00:00,2022-07-28T22:15:52+00:00,Save 10% when you shop!,Explore new releases and customer favorites all while saving 10% on your next purchase.
Y2LddK,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Save 10% when you shop,Explore new releases and customer favorites all while saving 10% on your next purchase.
TDCSTn,"Customer Winback: Email 4 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,We've Missed You!,Explore customer favorites.
WuPkMN,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:54+00:00,2022-07-28T22:15:56+00:00,Save 10% when you shop!,Explore new releases and customer favorites all while saving 10% on your next purchase.
ScjgNP,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:55+00:00,2022-07-28T22:15:56+00:00,Save 10% when you shop,Explore new releases and customer favorites all while saving 10% on your next purchase.
WeVzKC,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:55+00:00,2022-07-28T22:15:57+00:00,We've Missed You!,Explore customer favorites.
WuPkMN,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:54+00:00,2022-07-28T22:15:56+00:00,Save 10% when you shop!,Explore new releases and customer favorites all while saving 10% on your next purchase.
ScjgNP,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:55+00:00,2022-07-28T22:15:56+00:00,Save 10% when you shop,Explore new releases and customer favorites all while saving 10% on your next purchase.
WeVzKC,"Customer Winback: Email 2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:55+00:00,2022-07-28T22:15:57+00:00,We've Missed You!,Explore customer favorites.
Xhe9W2,[Email #1]-No Sms,2025-08-19T14:36:54+00:00,2025-08-21T15:49:29+00:00,Forgetting something?,Complete your order and support nonprofits with every sip.
WAx73g,[Email #1],2025-08-19T14:39:10+00:00,2025-08-22T10:37:48+00:00,Your Cart’s Waiting For You…,Complete your order and support nonprofits with every sip.
UdWqYV,SMS #2,2025-08-19T15:01:57+00:00,2025-09-20T08:50:32+00:00,,
WDYBap,Email #2 -SMS,2025-08-19T15:02:16+00:00,2025-10-06T16:49:02+00:00,Your cart is calling with 18% off,"Trusted by thousands, designed for everyday use."
XsYavC,Email #3-SMS-18%,2025-08-19T15:05:21+00:00,2025-10-06T16:55:54+00:00,Your purchase gives back with 18% off,Every product helps people and planet.
RHZetn,Copy of Email #2 - NO SMS,2025-08-19T15:10:25+00:00,2025-10-06T16:48:51+00:00,Your cart is calling with 15% off,"Trusted by thousands, designed for everyday use."
W4SiBM,Copy of Email #3-SMS-15%,2025-08-19T15:11:26+00:00,2025-10-06T16:55:40+00:00,Your purchase gives back with 15% off,Every product helps people and planet.
RTJK82,Email #4 -sms-18 %,2025-08-19T15:20:22+00:00,2025-09-20T08:50:56+00:00,From our founder to you: 18% off,
UuNbWP,Email #4 -sms-15 %,2025-08-19T15:21:43+00:00,2025-09-20T08:49:54+00:00,From our founder to you: 15% off,
WTbmYF,Email #1 - old customer,2025-08-19T15:23:34+00:00,2025-10-06T16:50:50+00:00,Your cart is waiting,Complete your order and support nonprofits with every sip.
RfTsp5,Email #2 -Old customer,2025-08-19T15:27:14+00:00,2025-10-06T16:52:04+00:00,It's still here,"Trusted by thousands, designed for everyday use."
VDgLBk,Email #3-old customer,2025-08-19T15:46:33+00:00,2025-09-20T08:49:33+00:00,Your purchase gives back.,Every product helps people and the planet.
RJnJdb,Email 4,2025-08-19T15:51:09+00:00,2025-09-20T08:49:44+00:00,A note from our founder: 10% off orders $50+,
TaLvXn,Email #8,2025-06-16T20:45:54+00:00,2025-06-16T21:36:10+00:00,Thanks for joining the Topo Giveaway!,
Xi25fz,Welcome Email #2: Responsibility,2025-06-16T20:45:56+00:00,2025-06-16T21:39:34+00:00,Here's how we drink responsibly,Learn about MiiR's commitment to people and planet.
XvSQ9e,Welcome Email #3: Promo Code Reminder + Product Features/Design,2025-06-16T20:46:01+00:00,2025-06-16T20:46:01+00:00,Basics but...innovative.,Save 15% on your first experience.
VtzbAz,Welcome Email #4: Generosity,2025-06-16T20:46:05+00:00,2025-06-16T21:41:31+00:00,We not me.,How you can be part of the Give Code™.
XrR7Js,"Purchase Anniversary, Year 2+",2025-04-22T17:40:27+00:00,2025-04-22T17:40:27+00:00,It's your (first purchase) anniversary!,
Upp8YH,"Purchase Anniversary, Year 1",2025-04-22T17:40:29+00:00,2025-04-22T17:40:29+00:00, Happy (first purchase) anniversary! Take 10% off!,
QUdgZw,Abandoned Cart: Email 1,2022-02-23T23:20:31+00:00,2022-02-24T02:17:30+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
Uv542u,Abandoned Cart: Email 2,2022-02-23T23:20:32+00:00,2024-11-20T18:25:11+00:00,Enjoy 10% Off Your Purchase,Don't miss out
URXer6,Copy of Email #1: Brand/Generosity,2025-08-19T12:37:24+00:00,2025-08-21T09:30:11+00:00,Still deciding? Your order’s saved,Come back soon.
SEpj98,Email #2,2025-08-19T12:48:35+00:00,2025-08-30T12:10:16+00:00,Your Cart is Calling You.,"Trusted by thousands, designed for everyday use."
UcGbzY,Email #2,2025-08-19T12:50:06+00:00,2025-08-30T12:10:09+00:00,Your Cart is Calling You.,"Trusted by thousands, designed for everyday use."
RDxeRH,Email #3,2025-08-19T12:53:31+00:00,2025-08-30T12:10:53+00:00,Your purchase gives back,Every product helps people and the planet
WVWp2j,Copy of Email #1: Brand/Generosity,2025-08-19T12:55:18+00:00,2025-08-22T10:41:08+00:00,Still deciding? Your order’s saved,Come back soon.
Yqdfa9,Email #3,2025-08-19T12:57:40+00:00,2025-08-30T12:10:57+00:00,Your purchase gives back,Every product helps people and the planet
RL4ZjD,SMS #2,2025-08-19T12:58:54+00:00,2025-08-30T12:23:22+00:00,,
UkhW6D,SMS #2,2025-08-19T13:02:46+00:00,2025-08-30T12:23:45+00:00,,
VjBLdU,Email #4,2025-08-19T13:03:57+00:00,2025-08-30T12:11:08+00:00,A personal note from our founder,
WqpkLn,Email #8,2025-08-19T13:04:00+00:00,2025-08-30T12:11:00+00:00,A personal note from our founder,
Y4fUzb,Abandoned Cart: Email 1,2021-10-15T16:50:55+00:00,2021-10-15T16:50:55+00:00,It looks like you left something behind...,
VCNYs5,Abandoned Cart: Email 2,2021-10-15T16:50:55+00:00,2021-10-15T16:50:55+00:00,Your cart is about to expire.,
XLvCYU,Email-1 without SMS,2025-07-26T14:26:01+00:00,2025-08-27T21:15:47+00:00,"Welcome to MiiR, {{first_name|title|default:""friend""}}!",Take 15% off your first order now.
WFnip2,Email-5 Without SMS,2025-07-26T14:44:34+00:00,2025-07-29T14:47:02+00:00,A personal note from our founder.,
TA7iXM,Email-2 Without SMS,2025-07-26T18:47:08+00:00,2025-08-27T21:20:21+00:00,Gear That Impacts You (And Others),The story behind MiiR favorites and founders.
RUzbW9,Email-3 Without SMS,2025-07-26T19:07:49+00:00,2025-08-27T21:21:23+00:00,Colorways 🌈,Choose the shade that fits your lifestyle. 
TsKym2,Email-4 Without SMS,2025-07-26T19:31:10+00:00,2025-07-29T15:05:00+00:00,Ask yourself: how much should a product give back?,
VahLHS,GiveCode Email #1,2022-07-28T00:22:47+00:00,2023-08-14T22:43:44+00:00,Welcome To Our Give Code™ Community!,"Get to know our nonprofit partner, Yellowstone Forever"
TUfFuC,GiveCode Email #2,2022-07-28T00:22:48+00:00,2022-07-28T22:16:01+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
VcLfq3,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
WhxPWv,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
UWSumR,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:59+00:00,2022-07-28T22:16:02+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
RPMfgJ,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:59+00:00,2022-07-28T22:16:02+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
VjZKWi,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:00+00:00,2022-07-28T22:16:03+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
X3Np7p,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:00+00:00,2022-07-28T22:16:03+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
VcLfq3,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
WhxPWv,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:58+00:00,2022-07-28T22:16:01+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
UWSumR,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:59+00:00,2022-07-28T22:16:02+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
RPMfgJ,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:59+00:00,2022-07-28T22:16:02+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
VjZKWi,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:16:00+00:00,2022-07-28T22:16:03+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
X3Np7p,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:16:00+00:00,2022-07-28T22:16:03+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
R4xJUR,2nd Purchase Nurture: Email #1,2021-06-15T19:27:48+00:00,2021-06-15T19:27:48+00:00,Just checking in...,and a little surprise!
WrPpsi,2nd Purchase Nurture: Email #2,2021-06-15T19:27:48+00:00,2021-06-15T19:27:48+00:00,Don't forget about your special offer!, 
SdWzNH,3+ Purchase Nurture: Email #1,2021-06-15T19:27:48+00:00,2021-06-15T19:27:48+00:00,Ready for something new?,...and a little surprise!
XBeeka,3+ Purchase Nurture: Email #2,2021-06-15T19:27:48+00:00,2021-06-15T19:27:48+00:00,Don't let free shipping go to waste..., 
VgG4VC,Welcome Email #1: Moss Program Subscribers,2025-01-30T20:34:14+00:00,2025-01-30T20:57:57+00:00,So you joined Moss?,Enjoy 15% off MiiR drinkware 🎉
U2DXGn,Welcome Email #2: Responsibility,2025-01-30T20:34:16+00:00,2025-01-30T20:34:16+00:00,Drinkware done responsibly,Our commitment to people and planet.
TiZEJm,Welcome Email #3: Product Features/Design,2025-01-30T20:34:18+00:00,2025-01-30T20:34:18+00:00,"Stylish, smart, and built for life","Elevate your day with iconic, innovative design."
Wcd8Mi,Welcome Email #4: Generosity,2025-01-30T20:34:20+00:00,2025-01-30T20:34:20+00:00,Sip. Give. Repeat.,How your purchase gives back. 
T9Ka3z,Welcome Email #3: Moss Promo Code Reminder + Product Features/Design,2025-01-30T20:34:22+00:00,2025-01-30T20:59:47+00:00,"Stylish, smart, and built for life","Elevate your day with iconic, innovative design."
TG8WiN,V2 Welcome Email #4: Generosity,2025-01-30T20:34:24+00:00,2025-01-30T20:34:24+00:00,Sip. Give. Repeat.,How your purchase gives back. 
XH3p5B,SMS #1,2024-10-14T19:23:56+00:00,2024-10-30T16:44:17+00:00,,
RGJFVx,SMS #2,2024-10-14T19:23:56+00:00,2024-10-14T20:17:11+00:00,,
Tvazs2,SMS #3,2024-10-14T19:23:56+00:00,2024-12-06T22:41:22+00:00,,
WsTrx4,Email #1,2020-09-17T02:01:58+00:00,2020-09-18T02:12:14+00:00,You Always Go The Extra Mile,"In gratitude for your service, take 40% off the next time you shop with us."
TZWVpw,Welcome Email #1: Signed up on DTC: Multi-step email & SMS with no SMS,2024-11-12T23:17:25+00:00,2024-11-13T03:37:03+00:00,⭐ Welcome! Here's 15% off your first order. ⭐,
SNtS4Q,SMS #1,2024-11-27T23:48:08+00:00,2025-10-14T18:04:44+00:00,,
Syk2jc,Email 1 – Party post purchase,2025-08-19T20:47:29+00:00,2025-08-19T20:47:29+00:00,Your Party Collection is here! 🎉,Let's see how you celebrate—share the joy!
TD7ARE,Email 2 – Party post purchase,2025-08-19T20:47:31+00:00,2025-08-19T20:47:31+00:00,Have you shared your #miirparty yet?🎉,We can’t wait to see your Party in action.
TGiqLi,SMS #1 - Post Party Purchase,2025-09-02T21:12:54+00:00,2025-09-02T21:23:02+00:00,,
THTvXH,Back in Stock: Email #1,2020-04-25T01:27:11+00:00,2022-08-09T23:57:11+00:00,The wait is over!,Your item is now back in stock
RvAbvd,"Welcome Series, Email #1 C",2021-06-21T13:19:26+00:00,2023-08-14T22:57:36+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
VCPJMq,"Welcome Series, Email #2 C",2021-06-21T13:19:27+00:00,2024-11-20T18:02:45+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
YAEtbK,"Welcome Series, Email #3 C",2021-06-21T13:19:27+00:00,2024-11-20T18:04:29+00:00,Add More Color To Your Life,
XkCmWv,"Welcome Series, Email #4 C",2021-06-21T13:19:28+00:00,2024-11-20T18:04:37+00:00,This is why I started MiiR,
Vtze6C,"Copy of Welcome Series, Email #1",2021-06-21T13:19:29+00:00,2023-08-14T22:32:55+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
SXv3C8,"Copy of Welcome Series, Email #2 B",2021-06-21T13:19:31+00:00,2024-11-20T18:02:53+00:00,Add More Color To Your Life,Learn about our global impact
R6rTLf,"Copy of Copy of Welcome Series, Email #3",2021-06-21T13:19:31+00:00,2024-11-20T18:04:33+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
TkCjcz,"Copy of Copy of Welcome Series, Email #5 B 1",2021-06-21T13:19:32+00:00,2024-11-20T18:04:41+00:00,Last Chance for 20% Off,Offer ends in 24 hours
VXWpwv,Email #1,2020-09-17T01:58:46+00:00,2020-09-18T02:24:24+00:00,We Can't Thank You Enough,"As an extension of our appreciation, save 40% the next time you shop with us."
WbtWxF,SMS #1,2024-12-06T10:10:03+00:00,2025-10-14T18:06:48+00:00,,
XXTQ4a,SMS #2,2024-12-06T10:10:03+00:00,2025-10-14T18:06:48+00:00,,
TL32qz,SMS #3,2024-12-06T10:10:03+00:00,2025-10-14T18:06:38+00:00,,
Wfu9T8,Offer SMS buyer retention - customers,2025-09-22T18:44:12+00:00,2025-09-22T18:44:12+00:00,,
Y3U3pB,SMS | Offer email buyer retention - customers,2025-09-22T18:44:13+00:00,2025-09-22T18:44:13+00:00,Need to recycle your MiiR?,Order a Takeback Kit + earn $15.
SzZ8wL,Email 2 Churn $10 off,2025-09-22T18:44:15+00:00,2025-09-22T18:44:15+00:00,An Invitation to Explore,For the intentional and conscientious.
YvEzjs,Final SMS Churn $10 off,2025-09-22T18:44:15+00:00,2025-09-22T18:44:15+00:00,,
UhMKFR,Email 2 Churn,2025-09-22T18:44:17+00:00,2025-09-22T18:44:17+00:00,An Invitation to Explore,For the intentional and conscientious.
T3KEsB,Sunset email 15% no purchase,2025-09-22T18:44:18+00:00,2025-09-22T18:44:18+00:00,Save 18% or unsubscribe?,No hard feelings!
TA9sHQ,SMS churn no purchases,2025-09-22T18:44:18+00:00,2025-09-22T18:44:18+00:00,,
XaZdJN,Offer email buyer retention - customers,2025-09-22T18:44:19+00:00,2025-09-22T18:44:19+00:00,Need to recycle your MiiR?,Order a Takeback Kit + earn $15.
U8xeZ5,Email 2 Churn $10 off,2025-09-22T18:44:22+00:00,2025-09-22T18:44:22+00:00,An Invitation to Explore,For the intentional and conscientious.
TqSW34,Email 2 Churn,2025-09-22T18:44:24+00:00,2025-09-22T18:44:24+00:00,An Invitation to Explore,For the intentional and conscientious.
RxPNbb,Sunset email 15% no purchase,2025-09-22T18:44:25+00:00,2025-09-22T18:44:25+00:00,Save 15% or unsubscribe?,No hard feelings!
Wi3Kbu,Abandoned Cart: Email 1 (Returning),2021-07-15T18:23:17+00:00,2021-07-20T15:29:33+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
T6jfJX,Abandoned Cart: Email 2 (Returning),2021-07-15T18:23:19+00:00,2021-07-15T18:49:17+00:00,See What’s New,You’ll love these…
Ty5MEN,Abandoned Cart: Email 1 (New),2021-07-15T18:23:20+00:00,2022-07-28T22:15:44+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
Y95SSQ,Abandoned Cart: Email 2 (New),2021-07-15T18:23:23+00:00,2022-07-28T22:15:45+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
WNqxic,Abandoned Cart: Email 3 (New),2021-07-15T18:23:24+00:00,2021-07-15T18:41:00+00:00,Are you sure?,Just a few days left!
WHMgWN,Abandoned Cart: Email 4 (New),2021-07-15T18:23:25+00:00,2021-07-15T18:41:04+00:00,Last Chance!,Your gift ends tonight
RiDRjf,Abandoned Cart: Email 1B (Returning),2021-07-20T15:32:21+00:00,2021-07-20T15:35:16+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
TpvKzC,Abandoned Cart: Email 2B (Returning),2021-07-20T17:30:15+00:00,2021-07-20T17:37:25+00:00,See What’s New,You’ll love these…
Rar9Ad,AC SMS #1,2021-10-19T19:51:26+00:00,2021-10-19T19:52:24+00:00,,
SUALUJ,AC SMS #2,2021-10-19T19:54:29+00:00,2021-10-19T19:55:21+00:00,,
VKphGH,"Abandoned Cart: Email 1 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:42+00:00,2022-07-28T22:15:43+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
TMGTvs,"Abandoned Cart: Email 1 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:43+00:00,2022-07-28T22:15:43+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
VKphGH,"Abandoned Cart: Email 1 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:42+00:00,2022-07-28T22:15:43+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
TMGTvs,"Abandoned Cart: Email 1 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:43+00:00,2022-07-28T22:15:43+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
RqSdzd,"Abandoned Cart: Email 2 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:44+00:00,2022-07-28T22:15:45+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
Ui5FCa,"Abandoned Cart: Email 2 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:45+00:00,2022-07-28T22:15:46+00:00,Right where you left off…,"Plus, save an extra 10%."
RqSdzd,"Abandoned Cart: Email 2 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:44+00:00,2022-07-28T22:15:45+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
Ui5FCa,"Abandoned Cart: Email 2 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:45+00:00,2022-07-28T22:15:46+00:00,Right where you left off…,"Plus, save an extra 10%."
XwtnYt,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2025-07-29T20:38:00+00:00,2025-07-29T20:38:00+00:00,Leave Something?,Welcome Back!
UtZqeJ,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2025-07-29T20:38:01+00:00,2025-07-29T20:38:01+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
XYdUUi,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2025-07-29T20:38:02+00:00,2025-07-29T20:38:02+00:00,Welcome Back!,Leave Something?
W7aM4r,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2025-07-29T20:38:03+00:00,2025-07-29T20:38:03+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
RggUNd,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2025-07-29T20:38:04+00:00,2025-07-29T20:38:04+00:00,Did you forget this?,Welcome Back!
TB6AzV,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2025-07-29T20:38:05+00:00,2025-07-29T20:38:05+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
Sm4vkF,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2025-07-29T20:38:07+00:00,2025-07-29T20:38:07+00:00,Did you forget this?,Welcome Back
STshBU,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2025-07-29T20:38:08+00:00,2025-07-29T20:38:08+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
R2p9L3,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2025-07-29T20:38:09+00:00,2025-07-29T20:38:09+00:00,{{ first_name|default:'' }} — Like This?,Welcome Back!
Wm4y6B,Q2 2025 | Browse Abandonment (Aimerce) - Email #1.1,2025-07-29T20:37:58+00:00,2025-07-29T20:38:18+00:00,{{ first_name|default:'' }} — Did you forget this?,Return where you left off.
XwtnYt,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2025-07-29T20:38:00+00:00,2025-07-29T20:38:00+00:00,Leave Something?,Welcome Back!
UtZqeJ,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2025-07-29T20:38:01+00:00,2025-07-29T20:38:01+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
XYdUUi,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2025-07-29T20:38:02+00:00,2025-07-29T20:38:02+00:00,Welcome Back!,Leave Something?
W7aM4r,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2025-07-29T20:38:03+00:00,2025-07-29T20:38:03+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
RggUNd,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2025-07-29T20:38:04+00:00,2025-07-29T20:38:04+00:00,Did you forget this?,Welcome Back!
TB6AzV,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2025-07-29T20:38:05+00:00,2025-07-29T20:38:05+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
Sm4vkF,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2025-07-29T20:38:07+00:00,2025-07-29T20:38:07+00:00,Did you forget this?,Welcome Back
STshBU,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2025-07-29T20:38:08+00:00,2025-07-29T20:38:08+00:00,{{ first_name|default:'' }} — Did you forget this?,Welcome Back!
R2p9L3,"Browse Abandonment: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2025-07-29T20:38:09+00:00,2025-07-29T20:38:09+00:00,{{ first_name|default:'' }} — Like This?,Welcome Back!
V9CH4e,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2025-07-29T20:38:11+00:00,2025-07-29T20:38:12+00:00,See What’s New,You’ll love these…
UwBErB,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2025-07-29T20:38:13+00:00,2025-07-29T20:38:13+00:00,See What’s New,You’ll love these!
WRrkdj,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2025-07-29T20:38:14+00:00,2025-07-29T20:38:14+00:00,See What’s New,You’ll love these…
UBeULZ,Browse Abandonment: email 2,2025-07-29T20:38:10+00:00,2025-07-29T20:38:14+00:00,Your Give Code™ journey awaits.,Head back to start.
V9CH4e,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation A",2025-07-29T20:38:11+00:00,2025-07-29T20:38:12+00:00,See What’s New,You’ll love these…
UwBErB,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation B",2025-07-29T20:38:13+00:00,2025-07-29T20:38:13+00:00,See What’s New,You’ll love these!
WRrkdj,"Browse Abandonment: Email 2 (Returning) Test #1 July 28, 2022 Variation C",2025-07-29T20:38:14+00:00,2025-07-29T20:38:14+00:00,See What’s New,You’ll love these…
WmiNBN,[Email #1],2025-09-20T09:40:05+00:00,2025-09-20T09:40:05+00:00,Your Cart’s Waiting For You…,Complete your order and support nonprofits with every sip.
VJhKZb,SMS #2,2025-09-20T09:40:05+00:00,2025-09-20T09:40:05+00:00,,
XwHDvE,Email #2 -SMS,2025-09-20T09:40:07+00:00,2025-09-20T09:40:07+00:00,Your Cart is Calling You. Get 18% Off,"Trusted by thousands, designed for everyday use."
WTGAT3,Email #3-SMS-18%,2025-09-20T09:40:09+00:00,2025-09-20T09:40:09+00:00,Your purchase gives back with 18% off,Every product helps people and the planet with 18% off.
UufEKV,Email #4 -sms-18 %,2025-09-20T09:40:09+00:00,2025-09-20T09:40:09+00:00,From our founder to you: 18% off,
Y57rLT,[Email #1]-No Sms,2025-09-20T09:40:11+00:00,2025-09-20T09:40:11+00:00,Forgetting something?,Complete your order and support nonprofits with every sip.
TReC9i,Copy of Email #2 - NO SMS,2025-09-20T09:40:12+00:00,2025-09-20T09:40:12+00:00,Your Cart is Calling You. Get 15% Off,"Trusted by thousands, designed for everyday use."
TedzwF,Copy of Email #3-SMS-15%,2025-09-20T09:40:15+00:00,2025-09-20T09:40:15+00:00,Your purchase gives back with 15% off,Every product helps people and the planet with 15% off.
UpCqqx,Email #4 -sms-15 %,2025-09-20T09:40:15+00:00,2025-09-20T09:40:15+00:00,From our founder to you: 15% off,
RYbuhr,Email #1 - old customer,2025-09-20T09:40:17+00:00,2025-09-20T09:40:17+00:00,Your Cart’s Waiting For You…,Complete your order and support nonprofits with every sip.
Vz3fip,Email #2 -Old customer,2025-09-20T09:40:18+00:00,2025-09-20T09:40:18+00:00,Your Cart is Calling You.,"Trusted by thousands, designed for everyday use."
T9Ajbh,Email #3-old customer,2025-09-20T09:40:20+00:00,2025-09-20T09:40:20+00:00,Your purchase gives back.,Every product helps people and the planet.
YwRXGJ,Email 4,2025-09-20T09:40:20+00:00,2025-09-20T09:40:20+00:00,A note from our founder: 10% off orders $50+,
RcfMy3,Email #1,2020-09-17T01:30:09+00:00,2020-09-18T02:14:34+00:00,"An Extra ""Thank You""",Enjoy 40% off as you settle back into the school year.
WQSFd6,Customer Winback: Email 1,2021-07-21T20:34:49+00:00,2021-07-21T20:45:23+00:00,Thought We'd Say Hi!,It's been a while so we thought we'd share what's new.
SCZRzv,Customer Winback: Email 2,2021-07-21T20:34:50+00:00,2021-07-21T20:45:21+00:00,We've Missed You!,Explore customer favorites.
YrsPe3,SMS #1,2024-12-06T22:37:46+00:00,2025-02-13T17:08:40+00:00,,
TqHUjx,Email #1,2025-09-13T17:41:42+00:00,2025-09-17T11:59:34+00:00,We’ve missed you.,Let’s reconnect with 10% off.
UqSewB,Email #2,2025-09-13T17:42:02+00:00,2025-09-17T11:59:55+00:00,Let me say thank you with something extra!,
SvwEdA,Copy of Email #1,2025-09-22T13:04:53+00:00,2025-09-22T13:04:53+00:00,We’ve missed you.,Let’s reconnect with 10% off.
XdLfXT,Copy of Email #2,2025-09-22T13:05:08+00:00,2025-10-06T17:00:42+00:00,Let us say thank you with something extra,
X5V8qN,SMS #1,2025-09-29T13:25:31+00:00,2025-09-30T20:59:33+00:00,,
UzXFVL,SMS #1,2025-09-29T13:28:41+00:00,2025-09-30T21:00:04+00:00,,
REjDB3,Post-Purchase Email #1A,2021-07-15T18:54:21+00:00,2021-07-21T19:09:45+00:00,You’re in the Family Now,Tips for your MiiR drinkware
TDHG8y,Post-Purchase Email #1B,2021-07-21T19:09:32+00:00,2021-07-21T19:09:56+00:00,You’re in the Family Now,Tips for your MiiR drinkware
SkJ6xX,Post-Purchase Email #2,2021-07-21T19:41:17+00:00,2024-11-20T18:07:42+00:00,Eyeing more MiiR?,Sustainably sip morning through happy hour
SKm6cP,Back in Stock: Email #1,2022-07-06T16:29:52+00:00,2022-07-06T16:29:52+00:00,The wait is over!,
R5rajf,Abandoned Cart: Email 1 (Returning),2021-02-24T21:11:21+00:00,2022-07-28T22:17:32+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
RUiXPx,Abandoned Cart: Email 2 (Returning),2021-02-24T21:11:23+00:00,2022-07-28T22:18:09+00:00,See What’s New,You’ll love these…
UMwrSu,Abandoned Cart: Email 3 (New),2021-02-24T21:11:24+00:00,2022-07-28T22:16:26+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
Yd7GcE,Abandoned Cart: Email 4 (New),2021-02-24T21:11:27+00:00,2022-07-28T22:17:53+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
V62t7x,Abandoned Cart: Email 5 (New),2021-02-24T21:11:29+00:00,2022-07-28T22:18:14+00:00,Are you sure?,Just a few days left!
XXdVau,Abandoned Cart: Email 6 (New),2021-02-24T21:11:30+00:00,2022-07-28T22:18:26+00:00,Last Chance!,Your gift ends tonight
Svj2hD,Abandoned Cart: Email 8 (New),2021-02-24T21:11:31+00:00,2022-07-28T22:16:58+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
XHka8i,Abandoned Cart: Email 9 (New),2021-02-24T21:11:33+00:00,2022-07-28T22:17:56+00:00,Are you sure?,Just a few days left.
Wti4T4,Abandoned Cart: Email 10 (New),2021-02-24T21:11:34+00:00,2022-07-28T22:18:15+00:00,Last Chance!,Your gift ends tonight...
TFZT4N,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:17+00:00,2022-07-28T22:16:25+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
YsguXC,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:17+00:00,2022-07-28T22:16:25+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
TwKnn2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:18+00:00,2022-07-28T22:16:26+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
Ts882C,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:19+00:00,2022-07-28T22:16:26+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
YcnHVs,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:19+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
QW3Vy8,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:20+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order...
TgRBjQ,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:20+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
S2Pw6A,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:21+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
WGsRE2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:22+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
SRHjAS,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation J",2022-07-28T22:16:22+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
XxkFai,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation K",2022-07-28T22:16:23+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
RsqHEQ,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation L",2022-07-28T22:16:24+00:00,2022-07-28T22:16:29+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TFZT4N,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:17+00:00,2022-07-28T22:16:25+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
YsguXC,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:17+00:00,2022-07-28T22:16:25+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
TwKnn2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:18+00:00,2022-07-28T22:16:26+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
Ts882C,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:19+00:00,2022-07-28T22:16:26+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
YcnHVs,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:19+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
QW3Vy8,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:20+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order...
TgRBjQ,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:20+00:00,2022-07-28T22:16:27+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
S2Pw6A,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:21+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
WGsRE2,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:22+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
SRHjAS,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation J",2022-07-28T22:16:22+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
XxkFai,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation K",2022-07-28T22:16:23+00:00,2022-07-28T22:16:28+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
RsqHEQ,"Abandoned Cart: Email 3 (New) Test #1 July 28, 2022 Variation L",2022-07-28T22:16:24+00:00,2022-07-28T22:16:29+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TpRRQE,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:54+00:00,2022-07-28T22:16:57+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
QYqVHy,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:54+00:00,2022-07-28T22:16:58+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
WmGAeZ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:55+00:00,2022-07-28T22:16:58+00:00,Right where you left off…,"Plus, save an extra 10%."
TWfE7T,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:55+00:00,2022-07-28T22:16:58+00:00,Right where you left off…,"Plus, a gift for you."
Xx7r8R,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:55+00:00,2022-07-28T22:16:59+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
TjeBvg,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:56+00:00,2022-07-28T22:16:59+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
Wh5jTB,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:56+00:00,2022-07-28T22:16:59+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
VE4hgY,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:57+00:00,2022-07-28T22:16:59+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
SBAixf,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:57+00:00,2022-07-28T22:17:00+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
TpRRQE,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:16:54+00:00,2022-07-28T22:16:57+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
QYqVHy,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:16:54+00:00,2022-07-28T22:16:58+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
WmGAeZ,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:16:55+00:00,2022-07-28T22:16:58+00:00,Right where you left off…,"Plus, save an extra 10%."
TWfE7T,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:16:55+00:00,2022-07-28T22:16:58+00:00,Right where you left off…,"Plus, a gift for you."
Xx7r8R,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:16:55+00:00,2022-07-28T22:16:59+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
TjeBvg,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation F",2022-07-28T22:16:56+00:00,2022-07-28T22:16:59+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
Wh5jTB,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation G",2022-07-28T22:16:56+00:00,2022-07-28T22:16:59+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
VE4hgY,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation H",2022-07-28T22:16:57+00:00,2022-07-28T22:16:59+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
SBAixf,"Abandoned Cart: Email 8 (New) Test #1 July 28, 2022 Variation I",2022-07-28T22:16:57+00:00,2022-07-28T22:17:00+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
WAwBbV,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:17:26+00:00,2022-07-28T22:17:29+00:00,Leave Something?,Welcome Back!
RKCJVH,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:17:26+00:00,2022-07-28T22:17:29+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
U6sqHr,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:17:26+00:00,2022-07-28T22:17:30+00:00,Welcome Back!,Leave Something?
SQqjub,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
WXDSLn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,Did you forget this?,Welcome Back!
RvJXTx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,{{ first_name|default:'' }} — Welcome Back,Leave Something?
TQyDFf,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:17:28+00:00,2022-07-28T22:17:31+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back
WbnjsX,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation H",2022-07-28T22:17:28+00:00,2022-07-28T22:17:31+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
W6K57z,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation I",2022-07-28T22:17:28+00:00,2022-07-28T22:17:31+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
UdFVfG,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation J",2022-07-28T22:17:29+00:00,2022-07-28T22:17:32+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
WAwBbV,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation A",2022-07-28T22:17:26+00:00,2022-07-28T22:17:29+00:00,Leave Something?,Welcome Back!
RKCJVH,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation B",2022-07-28T22:17:26+00:00,2022-07-28T22:17:29+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back!
U6sqHr,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation C",2022-07-28T22:17:26+00:00,2022-07-28T22:17:30+00:00,Welcome Back!,Leave Something?
SQqjub,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation D",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
WXDSLn,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation E",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,Did you forget this?,Welcome Back!
RvJXTx,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation F",2022-07-28T22:17:27+00:00,2022-07-28T22:17:30+00:00,{{ first_name|default:'' }} — Welcome Back,Leave Something?
TQyDFf,"Abandoned Cart: Email 1 (Returning) Test #1 July 28, 2022 Variation G",2022-07-28T22:17:28+00:00,2022-07-28T22:17:31+00:00,{{ first_name|default:'' }} — Leave Something?,Welcome Back
Vxhbt4,Email #1,2025-09-26T12:24:11+00:00,2025-09-27T09:04:06+00:00,Your MiiR order is on the move ✨,Your MiiR order is packed with purpose and heading your way. 
Xfvvns,Offer email buyer retention - customers,2025-08-01T15:35:10+00:00,2025-08-06T14:45:34+00:00,Need to recycle your MiiR?,Order a Takeback Kit + earn $15.
SZYVnE,Offer SMS buyer retention - customers,2025-08-01T15:57:53+00:00,2025-10-14T18:12:57+00:00,,
Sqh8Qd,SMS | Offer email buyer retention - customers,2025-08-01T16:02:46+00:00,2025-08-06T14:45:52+00:00,Need to recycle your MiiR?,Order a Takeback Kit + earn $15.
QRYwkQ,Email 2 Churn $10 off,2025-08-01T16:09:43+00:00,2025-08-06T14:46:14+00:00,An Invitation to Explore,For the intentional and conscientious.
WqZFwV,Email 2 Churn,2025-08-01T16:24:17+00:00,2025-08-06T14:45:42+00:00,An Invitation to Explore,For the intentional and conscientious.
YbqyST,Email 2 Churn,2025-08-01T16:24:36+00:00,2025-08-06T14:45:37+00:00,An Invitation to Explore,For the intentional and conscientious.
XqjvEc,Email 2 Churn $10 off,2025-08-01T16:25:40+00:00,2025-08-06T14:45:59+00:00,An Invitation to Explore,For the intentional and conscientious.
R5gx77,Sunset email 15% no purchase,2025-08-01T16:27:32+00:00,2025-08-06T14:46:03+00:00,Save 15% or unsubscribe?,No hard feelings!
WtgbEn,Sunset email 15% no purchase,2025-08-01T16:31:53+00:00,2025-08-06T14:45:55+00:00,Save 18% or unsubscribe?,No hard feelings!
VkPAYi,SMS churn no purchases,2025-08-01T16:33:50+00:00,2025-10-14T18:12:57+00:00,,
RKgPKs,Final SMS Churn $10 off,2025-08-01T17:07:22+00:00,2025-10-14T18:12:57+00:00,,
RScB5h,"Welcome Series, Email #1",2021-05-18T14:21:16+00:00,2022-07-28T22:16:04+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
SxPTSM,"Welcome Series, Email #2",2021-05-18T14:21:26+00:00,2022-07-28T22:16:32+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
Xdtfsd,"Welcome Series, Email #3",2021-05-18T14:21:28+00:00,2022-07-28T22:16:54+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
WvNWuc,"Copy of Welcome Series, Email #5 B 1",2021-05-18T14:21:31+00:00,2022-07-28T22:17:20+00:00,Last Chance for 20% Off,Offer ends in 24 hours
SdiSvd,"Copy of Welcome Series, Email #2",2021-05-18T14:21:33+00:00,2022-07-28T22:16:14+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
Ti6t3F,"Copy of Welcome Series, Email #3",2021-05-18T14:21:35+00:00,2022-07-28T22:16:35+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
Xrk2jS,"Copy of Welcome Series, Email #5 B 2",2021-05-18T14:21:38+00:00,2022-07-28T22:17:05+00:00,Last Chance for 20% Off,Offer ends in 24 hours
TFdJC8,"Welcome Series, Email #1 B",2021-05-18T14:21:40+00:00,2022-07-28T22:16:23+00:00,Welcome to MiiR,10% Off Your Next Purchase
SFEEtq,"Welcome Series, Email #2 B",2021-05-18T14:21:46+00:00,2022-07-28T22:16:40+00:00,Add More Color To Your Life,Learn about our global impact
ULAzcW,"Welcome Series, Email #3 B",2021-05-18T14:21:49+00:00,2022-07-28T22:17:09+00:00,Carbon Neutral Drinkware for Every Lifestyle,Products that give back
UBk4wa,"Welcome Series, Email #4 B",2021-05-18T14:21:52+00:00,2022-07-28T22:17:36+00:00,"Podcasts, Blogs, and Recipes","Come to learn, leave inspired"
V9HQMp,"Welcome Series, Email #5 B",2021-05-18T14:21:53+00:00,2022-07-28T22:17:42+00:00,Last Chance for 20% Off,Offer ends in 24 hours
SDDEiT,"Welcome Series, Email #1 C",2021-05-18T14:21:55+00:00,2022-07-28T22:16:26+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
W9SaYt,"Welcome Series, SMS #1 | A",2021-05-18T14:21:58+00:00,2021-05-18T14:21:58+00:00,,
XWi4uW,"Welcome Series, Email #2 C",2021-05-18T14:21:58+00:00,2022-07-28T22:17:02+00:00,Design Forward. Generosity Driven.,We exist to empower people for a better future through our product-to-project model of giving.
WU8J9m,"Welcome Series, Email #3 C",2021-05-18T14:22:00+00:00,2022-07-28T22:17:28+00:00,Add More Color To Your Life,
TBLYms,"Welcome Series, Email #4 C",2021-05-18T14:22:03+00:00,2022-07-28T22:17:39+00:00,This is why I started MiiR,
UGyyTU,"Copy of Welcome Series, Email #1",2021-05-18T14:22:05+00:00,2022-07-28T22:15:53+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
Scunrq,"Copy of Welcome Series, Email #2 B",2021-05-18T14:22:07+00:00,2022-07-28T22:16:29+00:00,Add More Color To Your Life,Learn about our global impact
Uxi4d8,"Copy of Copy of Welcome Series, Email #3",2021-05-18T14:22:09+00:00,2022-07-28T22:16:50+00:00,Sustainability Made Simple,Our stainless steel products make it easier to replace single-use drinkware.
RjzyLB,"Copy of Copy of Welcome Series, Email #5 B 1",2021-05-18T14:22:11+00:00,2022-07-28T22:17:18+00:00,Last Chance for 20% Off,Offer ends in 24 hours
SNK5p6,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
TNTpAa,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Ready to make the world a better place?,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
UP3HMe,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation I",2022-07-28T22:15:52+00:00,2022-07-28T22:15:54+00:00,Welcome to MiiR,"Thank you for joining us in our design forward, generosity driven mission!"
SNK5p6,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:51+00:00,2022-07-28T22:15:53+00:00,Welcome to MiiR!,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
TNTpAa,"Copy of Welcome Series, Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Ready to make the world a better place?,"We're grateful you decided to join us! Learn more about our design forward, generosity driven mission."
RbWedz,"GiveCode Email #1 Test #1 August 25, 2022 Variation A",2022-10-26T18:15:32+00:00,2022-10-26T18:15:32+00:00,Welcome To Our Give Code™ Community!,"Get to know our nonprofit partner, Yellowstone Forever"
U9LWBU,"GiveCode Email #1 Test #1 August 25, 2022 Variation B",2022-10-26T18:15:33+00:00,2022-10-26T18:15:33+00:00,"Get To Know Our Nonprofit Partner, Yellowstone Forever",Welcome To Our Give Code™ Community!
RJk2uN,"GiveCode Email #1 Test #1 August 25, 2022 Variation C",2022-10-26T18:15:33+00:00,2022-10-26T18:15:33+00:00,Thank You For Registering Your Give Code™,"Welcome to the community! Learn more about our featured nonprofit partner, Yellowstone Forever"
W2Q6tM,GiveCode Email #1,2022-10-26T18:15:32+00:00,2022-10-26T18:15:34+00:00,"Get To Know Our Nonprofit Partner, Yellowstone Forever",Welcome To Our Give Code™ Community!
RbWedz,"GiveCode Email #1 Test #1 August 25, 2022 Variation A",2022-10-26T18:15:32+00:00,2022-10-26T18:15:32+00:00,Welcome To Our Give Code™ Community!,"Get to know our nonprofit partner, Yellowstone Forever"
U9LWBU,"GiveCode Email #1 Test #1 August 25, 2022 Variation B",2022-10-26T18:15:33+00:00,2022-10-26T18:15:33+00:00,"Get To Know Our Nonprofit Partner, Yellowstone Forever",Welcome To Our Give Code™ Community!
RJk2uN,"GiveCode Email #1 Test #1 August 25, 2022 Variation C",2022-10-26T18:15:33+00:00,2022-10-26T18:15:33+00:00,Thank You For Registering Your Give Code™,"Welcome to the community! Learn more about our featured nonprofit partner, Yellowstone Forever"
SgHNL3,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-10-26T18:15:35+00:00,2022-10-26T18:15:35+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
WWmajt,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-10-26T18:15:35+00:00,2022-10-26T18:15:35+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
Y7KZdj,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-10-26T18:15:35+00:00,2022-10-26T18:15:36+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
XuJWAG,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-10-26T18:15:36+00:00,2022-10-26T18:15:36+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
UsgXQX,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-10-26T18:15:37+00:00,2022-10-26T18:15:37+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
RpNZ7e,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-10-26T18:15:37+00:00,2022-10-26T18:15:37+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
STJRnE,GiveCode Email #2,2022-10-26T18:15:34+00:00,2022-10-26T18:15:37+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
SgHNL3,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-10-26T18:15:35+00:00,2022-10-26T18:15:35+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
WWmajt,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-10-26T18:15:35+00:00,2022-10-26T18:15:35+00:00,Thank you for registering your Give Code™!,Get to Know Project #72 with Bike Works
Y7KZdj,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-10-26T18:15:35+00:00,2022-10-26T18:15:36+00:00,Get to Know Project #72 with Bike Works,"Welcome to the community, and we're excited to have you on this journey."
XuJWAG,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-10-26T18:15:36+00:00,2022-10-26T18:15:36+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
UsgXQX,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-10-26T18:15:37+00:00,2022-10-26T18:15:37+00:00,Get to Know Project #72 with Bike Works,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
RpNZ7e,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-10-26T18:15:37+00:00,2022-10-26T18:15:37+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
TnPQSh,Email #1,2025-08-22T11:48:24+00:00,2025-08-22T11:48:24+00:00,Email #1 Subject,
UtkygL,Email #1,2025-09-22T13:34:08+00:00,2025-09-22T13:34:08+00:00,Thank You for Choosing Purposeful Design ✨,"We’re preparing your order, and your impact is already underway."
XrbgF7,Email #2,2025-09-22T13:34:09+00:00,2025-09-22T13:34:09+00:00,Your Feedback Matters to Us!,"Tell us, how’s the journey going with your MiiR gear?"
QT9DdL,Abandoned Cart [Email #1],2025-07-29T20:38:01+00:00,2025-07-29T20:38:01+00:00,Forgetting something?,Complete your order and support nonprofits with every sip.
TLm7gH,SMS #1,2025-07-29T20:38:01+00:00,2025-08-30T13:05:44+00:00,,
XmcShF,Abandoned Cart [Email #2],2025-07-29T20:38:03+00:00,2025-07-29T20:38:03+00:00,Still deciding?,Check out our glowing reviews ⭐⭐⭐⭐⭐
RThXqQ,Abandoned Cart [Email #3] Welcome Discount Reminder,2025-07-29T20:38:04+00:00,2025-07-29T20:38:04+00:00,Your cart is waiting—and so is your discount,Snag your favorites before they sell out.
XbWmAT,Copy of Abandoned Cart [Email #3] 10% Discount,2025-07-29T20:38:06+00:00,2025-07-29T20:38:06+00:00,Your cart deserves a little treat,10% code expires in 48 hours.
XJk9S8,Abandoned Cart [Email #4],2025-07-29T20:38:08+00:00,2025-07-29T20:38:08+00:00,Your 10% off expires today⌛,Lock in your discount now before it's too late.
TrQ5T9,Copy of Abandoned Cart [Email #3] NO Discount | Free Shipping Over $75 Reminder,2025-07-29T20:38:09+00:00,2025-07-29T20:38:09+00:00,Your cart is waiting,"We'll hold it for you, but your cart is getting pretty lonely."
RUCchs,GiveCode email 2,2025-09-23T22:22:06+00:00,2025-09-23T22:34:23+00:00,Thank you for registering!,Enjoy your $15
RvtUyu,SMS Give Code promo code,2025-09-23T22:22:12+00:00,2025-10-14T18:18:16+00:00,,
UxJEjL,Copy of GiveCode email 2,2025-09-29T17:55:11+00:00,2025-09-29T17:55:11+00:00,Thank you for registering!,Enjoy your $15
SjQhWw,Welcome Email #1: Terradrift Giveaway Subscribers,2025-01-10T21:17:11+00:00,2025-01-10T21:17:11+00:00,Thanks for subscribing!,Your 15% discount awaits 🎉
XCuG8z,Welcome Email #2: Responsibility,2025-01-10T21:17:14+00:00,2025-01-10T21:17:14+00:00,Drinkware done responsibly,Our commitment to people and planet.
QZaWmS,Welcome Email #3: Product Features/Design,2025-01-10T21:17:16+00:00,2025-01-10T21:17:16+00:00,"Stylish, smart, and built for life","Elevate your day with iconic, innovative design."
TWZELd,Welcome Email #4: Generosity,2025-01-10T21:17:17+00:00,2025-01-10T21:17:17+00:00,Sip. Give. Repeat.,How your purchase gives back. 
S5WwUk,Welcome Email #3: Terradrift Promo Code Reminder + Product Features/Design,2025-01-10T21:17:20+00:00,2025-01-10T21:17:20+00:00,"Stylish, smart, and built for life","Elevate your day with iconic, innovative design."
XZBXH2,V2 Welcome Email #4: Generosity,2025-01-10T21:17:21+00:00,2025-01-10T21:17:21+00:00,Sip. Give. Repeat.,How your purchase gives back. 
VhNjgX,GiveCode Email #2,2020-10-15T20:55:02+00:00,2022-07-28T22:15:52+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
V3Tabs,GiveCode Email #1,2021-03-09T23:34:10+00:00,2022-07-28T22:15:47+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
VhCKLS,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:45+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Y6cXur,"GiveCode Email #1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Thank you for registering your Give Code™!,Get to Know Project #71 with Black Girl Ventures
Ytkf4S,"GiveCode Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Get to Know Project #71 with Black Girl Ventures,"Welcome to the community, and we're excited to have you on this journey."
XF4FKt,"GiveCode Email #1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
XvNb4F,"GiveCode Email #1 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:47+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Wb8Pu3,"GiveCode Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:45+00:00,2022-07-28T22:15:48+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
VhCKLS,"GiveCode Email #1 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:45+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Y6cXur,"GiveCode Email #1 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Thank you for registering your Give Code™!,Get to Know Project #71 with Black Girl Ventures
Ytkf4S,"GiveCode Email #1 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:46+00:00,Get to Know Project #71 with Black Girl Ventures,"Welcome to the community, and we're excited to have you on this journey."
XF4FKt,"GiveCode Email #1 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
XvNb4F,"GiveCode Email #1 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:47+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
Wb8Pu3,"GiveCode Email #1 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:45+00:00,2022-07-28T22:15:48+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
Xwpr73,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:48+00:00,2022-07-28T22:15:51+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
TdTm84,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:49+00:00,2022-07-28T22:15:52+00:00,Thank you for registering your Give Code™!,Get to Know Project #71 with Black Girl Ventures
YwxKi7,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:49+00:00,2022-07-28T22:15:53+00:00,Get to Know Project #71 with Black Girl Ventures,"Welcome to the community, and we're excited to have you on this journey."
Ue3Fj8,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:50+00:00,2022-07-28T22:15:53+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
RHXuQC,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:50+00:00,2022-07-28T22:15:54+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
VRd48P,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
Xwpr73,"GiveCode Email #2 Test #1 July 28, 2022 Variation A",2022-07-28T22:15:48+00:00,2022-07-28T22:15:51+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
TdTm84,"GiveCode Email #2 Test #1 July 28, 2022 Variation B",2022-07-28T22:15:49+00:00,2022-07-28T22:15:52+00:00,Thank you for registering your Give Code™!,Get to Know Project #71 with Black Girl Ventures
YwxKi7,"GiveCode Email #2 Test #1 July 28, 2022 Variation C",2022-07-28T22:15:49+00:00,2022-07-28T22:15:53+00:00,Get to Know Project #71 with Black Girl Ventures,"Welcome to the community, and we're excited to have you on this journey."
Ue3Fj8,"GiveCode Email #2 Test #1 July 28, 2022 Variation D",2022-07-28T22:15:50+00:00,2022-07-28T22:15:53+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
RHXuQC,"GiveCode Email #2 Test #1 July 28, 2022 Variation E",2022-07-28T22:15:50+00:00,2022-07-28T22:15:54+00:00,Get to Know Project #71 with Black Girl Ventures,"Thank you for registering your Give Code™! Welcome to the community, and we're excited to have you on this journey."
VRd48P,"GiveCode Email #2 Test #1 July 28, 2022 Variation F",2022-07-28T22:15:51+00:00,2022-07-28T22:15:54+00:00,Thank you for registering your Give Code™!,"Welcome to the community, and we're excited to have you on this journey."
RN9mzv,Lapsed: Email #1a,2025-07-15T19:12:04+00:00,2025-08-01T17:16:15+00:00,Do you want to reconnect?,This is our last email (unless you tell us).
Skx9QJ,Never purchased: Email #1b,2025-07-15T19:12:05+00:00,2025-07-21T13:29:03+00:00,Are you still there?,"No hard feelings if you left, just let us know."
XV7TXR,"Never purchased: Email #1b Test #1 July 21, 2025 Variation A",2025-07-21T13:33:54+00:00,2025-07-21T13:33:54+00:00,Are you still there?,"No hard feelings if you left, just let us know."
T6e3HD,"Never purchased: Email #1b Test #1 July 21, 2025 Variation B",2025-07-21T13:33:55+00:00,2025-07-21T13:33:55+00:00,Are you still there?,"No hard feelings if you left, just let us know."
XV7TXR,"Never purchased: Email #1b Test #1 July 21, 2025 Variation A",2025-07-21T13:33:54+00:00,2025-07-21T13:33:54+00:00,Are you still there?,"No hard feelings if you left, just let us know."
T6e3HD,"Never purchased: Email #1b Test #1 July 21, 2025 Variation B",2025-07-21T13:33:55+00:00,2025-07-21T13:33:55+00:00,Are you still there?,"No hard feelings if you left, just let us know."
RTcGnF,Added to Cart: Email 1 (Returning),2020-11-18T18:24:44+00:00,2022-07-28T22:16:15+00:00,{{ first_name|default:'' }} Welcome Back,Leave Something?
R6V95g,Added to Cart: Email 4 (New),2020-11-18T18:24:46+00:00,2024-11-20T18:20:14+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
X3QPgT,Added to Cart: Email 3 (New),2020-11-18T20:55:29+00:00,2022-07-28T22:15:50+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
RsrxAk,Added to Cart: Email 2 (Returning),2020-11-24T04:36:42+00:00,2022-07-28T22:16:48+00:00,See What’s New,You’ll love these…
VwAkCL,Added to Cart: Email 7 (New),2020-11-24T04:45:32+00:00,2022-07-28T22:15:45+00:00,Right where you left off…,"Plus, a gift for you."
TV55E7,Added to Cart: Email 5 (New),2020-11-25T19:51:22+00:00,2024-11-20T18:20:18+00:00,Are you sure?,Just a few days left!
Xyx6RW,Added to Cart: Email 6 (New),2020-11-25T19:51:38+00:00,2024-11-20T18:20:29+00:00,Last Chance!,Your gift ends tonight...
YaA8mq,Added to Cart: Email 8 (New),2020-11-25T23:14:08+00:00,2024-11-20T18:21:16+00:00,Are you sure?,Just a few days left.
RRy9WQ,Added to Cart: Email 9 (New),2020-11-25T23:15:55+00:00,2024-11-20T18:21:27+00:00,Last Chance!,Your gift ends tonight...
XS6mve,Copy of Added to Cart: Email 5 (New),2020-12-10T18:56:16+00:00,2022-07-28T22:15:58+00:00,Are you sure?,Just a few days left.
RdkRCn,Copy of Added to Cart: Email 6 (New),2020-12-10T18:56:39+00:00,2024-11-20T18:20:45+00:00,Last Chance!,Your gift ends tonight...
URPWt9,Copy of Added to Cart: Email 8 (New),2021-01-08T19:47:59+00:00,2024-11-20T18:20:59+00:00,Are you sure?,Just a few days left!
TH2mBD,Copy of Added to Cart: Email 9 (New) 1,2021-01-08T19:48:30+00:00,2024-11-20T18:21:20+00:00,Last Chance!,Your gift ends tonight
QSVYpx,Copy of Added to Cart: Email 9 (New) 2,2021-03-27T19:35:05+00:00,2024-11-20T18:21:24+00:00,Last Chance!,Your gift ends tonight...
XFExJz,A2C SMS #2,2021-05-18T13:00:22+00:00,2021-10-19T20:00:06+00:00,,
UEBHaf,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
WUN8Az,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
YxXvqg,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Right where you left off…,"Plus, save an extra 10%."
SZrkc3,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Right where you left off…,"Plus, a gift for you."
UCAGZJ,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
UEBHaf,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
WUN8Az,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:42+00:00,2022-07-28T22:15:44+00:00,"Don't Worry, We Saved Your Order","Plus, a gift for you. And! We made it easy to return to where you left off."
YxXvqg,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Right where you left off…,"Plus, save an extra 10%."
SZrkc3,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:43+00:00,2022-07-28T22:15:45+00:00,Right where you left off…,"Plus, a gift for you."
UCAGZJ,"Added to Cart: Email 7 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:44+00:00,2022-07-28T22:15:46+00:00,"Don't Worry, We Saved Your Order","Plus, save an extra 10%. And! We made it easy to return to where you left off."
RZSg3j,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
Ug4FtD,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
SVpjSZ,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
UDbX46,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
SL8Pcd,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
RZSg3j,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Leave Something?,We saved your order and made it easy to return to where you left off.
Ug4FtD,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,Forgetting something?,We saved your order and made it easy to return to where you left off.
SVpjSZ,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation C",2022-07-28T22:15:47+00:00,2022-07-28T22:15:49+00:00,You forgot something…,We saved your order and made it easy to return to where you left off.
UDbX46,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation D",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,You forgot this…,We saved your order and made it easy to return to where you left off.
SL8Pcd,"Added to Cart: Email 3 (New) Test #1 July 28, 2022 Variation E",2022-07-28T22:15:48+00:00,2022-07-28T22:15:50+00:00,You forgot this!,We saved your order and made it easy to return to where you left off.
VZ3NHs,"Copy of Added to Cart: Email 5 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:57+00:00,2022-07-28T22:15:57+00:00,Are you sure?,Just a few days left.
U7YERz,"Copy of Added to Cart: Email 5 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:57+00:00,2022-07-28T22:15:58+00:00,Are you sure?,Just a few days left!
VZ3NHs,"Copy of Added to Cart: Email 5 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:57+00:00,2022-07-28T22:15:57+00:00,Are you sure?,Just a few days left.
U7YERz,"Copy of Added to Cart: Email 5 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:57+00:00,2022-07-28T22:15:58+00:00,Are you sure?,Just a few days left!
W8hjfH,"Copy of Added to Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:59+00:00,2024-11-20T18:20:58+00:00,Are you sure?,Just a few days left.
W3E4Uj,"Copy of Added to Cart: Email 8 (New) Test #1 July 28, 2022 Variation B",2022-07-28T22:15:59+00:00,2024-11-20T18:20:58+00:00,Are you sure?,Just a few days left!
W8hjfH,"Copy of Added to Cart: Email 8 (New) Test #1 July 28, 2022 Variation A",2022-07-28T22:15:59+00:00,2024-11-20T18:20:58+00:00,Are you sure?,Just a few days left.
XKPgPV,Site Abandonment Email 1 - Bestsellers,2025-08-01T17:25:57+00:00,2025-08-13T18:41:08+00:00,Need some inspiration?,Here are some of our favorites.
VPzsCZ,SMS #1 - site abandonment,2025-08-13T18:33:13+00:00,2025-08-30T12:26:03+00:00,,
SWKdiU,SMS welcome message 1,2025-04-08T17:49:56+00:00,2025-06-12T19:08:56+00:00,,
VN4rcN,SMS welcome message 2,2025-04-08T17:55:12+00:00,2025-10-14T18:23:19+00:00,,
RkzbCs,Copy of Email #1: Brand/Generosity,2025-09-20T09:38:29+00:00,2025-09-20T09:38:29+00:00,Still deciding? Your order’s saved,Come back soon.
WHQQ9T,Email #2,2025-09-20T09:38:30+00:00,2025-09-20T09:38:30+00:00,Your Cart is Calling You.,"Trusted by thousands, designed for everyday use."
RSWXTF,SMS #2,2025-09-20T09:38:30+00:00,2025-09-20T09:38:30+00:00,,
UQMGi2,Email #3,2025-09-20T09:38:32+00:00,2025-09-20T09:38:32+00:00,Your purchase gives back,Every product helps people and the planet
RNjHyh,Email #4,2025-09-20T09:38:32+00:00,2025-09-20T09:38:32+00:00,A personal note from our founder,
Vpbuzf,Copy of Email #1: Brand/Generosity,2025-09-20T09:38:33+00:00,2025-09-20T09:38:33+00:00,Still deciding? Your order’s saved,Come back soon.
SkHvPw,Email #2,2025-09-20T09:38:34+00:00,2025-09-20T09:38:34+00:00,Your Cart is Calling You.,"Trusted by thousands, designed for everyday use."
Tw8kHn,SMS #2,2025-09-20T09:38:35+00:00,2025-09-20T09:38:35+00:00,,
ViyedR,Email #3,2025-09-20T09:38:36+00:00,2025-09-20T09:38:36+00:00,Your purchase gives back,Every product helps people and the planet
R6FqAg,Email #8,2025-09-20T09:38:36+00:00,2025-09-20T09:38:36+00:00,A personal note from our founder,
VHJ4Jt,SMS #1,2025-05-19T20:26:56+00:00,2025-05-19T20:26:56+00:00,,
RvRf6S,Email #1,2025-05-19T20:26:57+00:00,2025-05-19T20:26:57+00:00,Price Drop Alert!,
Ui9XTd,Welcome Email #1: Main List,2025-05-22T08:00:25+00:00,2025-05-22T08:01:33+00:00,Welcome to MiiR!,Your free shipping awaits 🎉
XfYGhy,Welcome Email #2: Responsibility,2025-05-22T08:00:27+00:00,2025-05-22T08:00:27+00:00,Drink responsibly,Here's how you are part of the movement. 
XNnuyM,Welcome Email #3: Product Features/Design,2025-05-22T08:00:29+00:00,2025-05-22T08:00:29+00:00,You did it!,Discover the MiiR philosophy that drives everything we do.
VVjkGU,Welcome Email #4: GiveCode,2025-05-22T08:00:31+00:00,2025-05-22T08:00:31+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
U4gcR3,Welcome Email #3: Promo Code Reminder + Product Features/Design,2025-05-22T08:00:34+00:00,2025-05-22T08:01:52+00:00,Basics but...innovative.,Get free shipping on your first experience.
UADZ8g,Welcome Email #4: GiveCode,2025-05-22T08:00:36+00:00,2025-05-22T08:00:36+00:00,What's the code on your bottle? 🔍,Opt into the Give Code™ journey.
Ryc2nx,Welcome Email #4: Generosity,2025-05-22T08:00:38+00:00,2025-05-22T08:00:38+00:00,We not me,How you can be part of the GiveCode
`,
    campaign_messages_data: `campaign_message_id,campaign_id,message_id,message_created_at,message_updated_at,preview_text,subject_line
01K77K3VZKNEBTCP691G0M9JET,01K77K3VWQKVN0PEH4QBZTXEGM,01K77K3VZKNEBTCP691G0M9JET,2025-10-10T17:36:20.470055+00:00,2025-10-10T17:37:19.123341+00:00,,
01K74X9FYDZQWVVFSXJYXC2TD4,01K74X9FW93XHBNZN06YFJ58K1,01K74X9FYDZQWVVFSXJYXC2TD4,2025-10-09T16:36:27.216976+00:00,2025-10-09T16:37:25.083665+00:00,,
01K71XE5N1JEWMWHH50KW9TA1P,01K71XE5K0QB65RTE334BNDCB3,01K71XE5N1JEWMWHH50KW9TA1P,2025-10-08T12:41:17.220276+00:00,2025-10-08T15:42:51.531252+00:00,,
01K6D4GK2CBNP19193P91D6Y4T,01K6D4GK0MF9185V6TM6W0A9Q1,01K6D4GK2CBNP19193P91D6Y4T,2025-09-30T11:00:53.456599+00:00,2025-10-01T19:31:51.006049+00:00,,
01K663A97SJCZXM922GC34N5K1,01K663A96J61ZFVJJTJSWJDCBB,01K663A97SJCZXM922GC34N5K1,2025-09-27T17:25:17.178966+00:00,2025-09-29T16:01:07.533682+00:00,,
01K663DFRXX6CR3X3TR8RADTSJ,01K663A96J61ZFVJJTJSWJDCBB,01K663DFRXX6CR3X3TR8RADTSJ,2025-09-27T17:27:02.177234+00:00,2025-09-29T15:54:06.339397+00:00,,
01K60738S87NKA2V7GDK4QCQ5V,01K60738QQKCHYJN2PBVA7RZFE,01K60738S87NKA2V7GDK4QCQ5V,2025-09-25T10:35:55.052284+00:00,2025-09-25T13:32:37.698345+00:00,,
01K5KVCRGV1QESSR5WGVMSYDPC,01K5KVCRFKQZYEJD66JT0CT6K7,01K5KVCRGV1QESSR5WGVMSYDPC,2025-09-20T15:20:30+00:00,2025-09-23T17:00:23+00:00,,
01K5H7REXQQ8MW4T8Z72P38V2E,01K5H7REW4W637RWX5447JYQN1,01K5H7REXQQ8MW4T8Z72P38V2E,2025-09-19T14:58:53+00:00,2025-09-20T17:00:16+00:00,,
01K5C8QPFFC1K56365623X045A,01K5C8QPDW374JST7BTVS3SWR1,01K5C8QPFFC1K56365623X045A,2025-09-17T16:39:44+00:00,2025-09-17T20:00:09+00:00,,
01K5C8QQCD8WR97H2P6B5RJQZ6,01K5C8QPDW374JST7BTVS3SWR1,01K5C8QQCD8WR97H2P6B5RJQZ6,2025-09-17T16:39:45+00:00,2025-09-17T20:00:09+00:00,,
01K59H98Z2V08PR1Q49MPQ45YM,01K59H98XVE9706NCXRVS25DE2,01K59H98Z2V08PR1Q49MPQ45YM,2025-09-16T15:11:26+00:00,2025-09-17T16:39:17+00:00,,
01K59HD8RF85MHETQC5Q8ZQHCV,01K59H98XVE9706NCXRVS25DE2,01K59HD8RF85MHETQC5Q8ZQHCV,2025-09-16T15:13:37+00:00,2025-09-17T16:39:17+00:00,,
01K4QNJZF2HT0R6NS0YSXYVPN2,01K4QNJZDS1FRPYM55MCHN4NK1,01K4QNJZF2HT0R6NS0YSXYVPN2,2025-09-09T16:40:18+00:00,2025-09-13T16:00:24+00:00,,
01K4Q1E760YAEHCCJ351CECDG8,01K4Q1E74V6WYEVRA1GN0NQ2YR,01K4Q1E760YAEHCCJ351CECDG8,2025-09-09T10:48:11+00:00,2025-09-10T17:00:53+00:00,,
01K47KYSG7YX2TGP762HT4FSJ1,01K47KYSE91ZBX3GZX7QW0YVJ1,01K47KYSG7YX2TGP762HT4FSJ1,2025-09-03T11:03:57+00:00,2025-09-04T01:00:24+00:00,,
01K3RHYT99H24EAHM6429GVCEF,01K3RHYT81R2V2YYQCHM616BEC,01K3RHYT99H24EAHM6429GVCEF,2025-08-28T14:40:24+00:00,2025-08-31T23:00:57+00:00,,
01K3RJ0BWM62Y1ZJ7VD1VZN2RE,01K3RHYT81R2V2YYQCHM616BEC,01K3RJ0BWM62Y1ZJ7VD1VZN2RE,2025-08-28T14:41:15+00:00,2025-08-31T23:00:57+00:00,,
01K3R2BZ7VA82FJSQW67V8J7WC,01K3R2BZ6KR79ZRXNV1C4SCG3W,01K3R2BZ7VA82FJSQW67V8J7WC,2025-08-28T10:07:58+00:00,2025-08-30T01:00:08+00:00,,
01K3VE112CQ50S8SPCDGFS1Q7M,01K3R2BZ6KR79ZRXNV1C4SCG3W,01K3VE112CQ50S8SPCDGFS1Q7M,2025-08-29T17:29:26+00:00,2025-08-30T01:00:08+00:00,,
01K3GEPXTVEGSGE6R038VJ293T,01K3GEPXSG0CKRSRT4WP0S09B1,01K3GEPXTVEGSGE6R038VJ293T,2025-08-25T11:09:45+00:00,2025-08-27T01:00:03+00:00,,
01K3H0JXH4D6FAW2GD8JPSEBX0,01K3GEPXSG0CKRSRT4WP0S09B1,01K3H0JXH4D6FAW2GD8JPSEBX0,2025-08-25T16:22:08+00:00,2025-08-27T01:00:03+00:00,,
01K398EFN9MQ15DA6BWTGAS3MS,01K398EE7GTNEQDZ0X8P412RGY,01K398EFN9MQ15DA6BWTGAS3MS,2025-08-22T16:05:36+00:00,2025-08-24T20:00:16+00:00,,
01K31CW62MQ3RYP1N8V2HSKDF4,01K31CW60Q90VT4E5WMRCS000C,01K31CW62MQ3RYP1N8V2HSKDF4,2025-08-19T14:49:03+00:00,2025-08-21T08:00:40+00:00,,
01K31EDHMTYPDX2S4G80AHSQZ9,01K31CW60Q90VT4E5WMRCS000C,01K31EDHMTYPDX2S4G80AHSQZ9,2025-08-19T15:16:01+00:00,2025-08-21T08:00:40+00:00,,
01K2HCG6A2S1NSMVPBF7C2A0K8,01K2HCG68SJSQX4WK7CXY4JD7C,01K2HCG6A2S1NSMVPBF7C2A0K8,2025-08-13T09:34:39+00:00,2025-08-15T01:00:16+00:00,,
01K2HFCX7AD8DV72MP9ZZ1VAJZ,01K2HCG68SJSQX4WK7CXY4JD7C,01K2HFCX7AD8DV72MP9ZZ1VAJZ,2025-08-13T10:25:18+00:00,2025-08-15T01:00:16+00:00,,
01K22QGMR1QPRCJ6E2BR7GFD8S,01K22QGMPK9YRP4AZQPDHTYG9N,01K22QGMR1QPRCJ6E2BR7GFD8S,2025-08-07T16:58:32+00:00,2025-08-09T01:00:10+00:00,,
01K1GCAEJ40G1MWB077CC197HT,01K1GCAEGYMCFC1R749AF4A9GT,01K1GCAEJ40G1MWB077CC197HT,2025-07-31T13:56:35+00:00,2025-08-04T01:00:02+00:00,,
01K1B3WH4XDHN8HAEP28DH0VJK,01K1B3WH3PBA7KER037FCVJMS3,01K1B3WH4XDHN8HAEP28DH0VJK,2025-07-29T12:52:58+00:00,2025-07-31T01:00:23+00:00,,
01K0XXTKZESHFW9DPA97T22NMH,01K0XXTJ13R2FMX2AKHE3YTKVR,01K0XXTKZESHFW9DPA97T22NMH,2025-07-24T09:56:56+00:00,2025-07-26T01:00:21+00:00,,
01K0H52KDS028ZK5GRS2GB0R1V,01K0H52KCCDKA6ECRWAZPJJJRP,01K0H52KDS028ZK5GRS2GB0R1V,2025-07-19T10:53:30+00:00,2025-07-22T00:59:52+00:00,,
01K0CJXPWRKF0RAB0P2X89Q118,01K0CJXPT74M081DR6KGTN65WN,01K0CJXPWRKF0RAB0P2X89Q118,2025-07-17T16:19:18+00:00,2025-07-18T17:29:56+00:00,,
01K04K0EV79Y8V6GZY08HDWPD6,01K04K0ET03SQ63F2ZEDV6YTWS,01K04K0EV79Y8V6GZY08HDWPD6,2025-07-14T13:46:53+00:00,2025-07-16T02:59:57+00:00,,
01K06ZKGN949RX3GSC28H213Y0,01K04K0ET03SQ63F2ZEDV6YTWS,01K06ZKGN949RX3GSC28H213Y0,2025-07-15T12:05:29+00:00,2025-07-16T02:59:57+00:00,,
01JZQ6JCBJY6AQWXB670STF07F,01JZQ6JCA9YWFZ2R1KEGB28EQK,01JZQ6JCBJY6AQWXB670STF07F,2025-07-09T08:59:21+00:00,2025-07-10T01:00:22+00:00,,
01JZ394GRP61TAY29CFEJ2TF4W,01JZ394GQM1JWQKS5HQRXN2007,01JZ394GRP61TAY29CFEJ2TF4W,2025-07-01T15:19:24+00:00,2025-07-02T17:29:55+00:00,,
01JYRHATYYQDEEDEWPDK71YY48,01JYRHATXRX8FW7HA88HGE6MWR,01JYRHATYYQDEEDEWPDK71YY48,2025-06-27T11:11:01+00:00,2025-06-28T17:32:39+00:00,,
01JYGVZZMW54KT6RGH8NZDBE60,01JYGVZZKT2MNHYWZYQ8WKFAT6,01JYGVZZMW54KT6RGH8NZDBE60,2025-06-24T11:43:24+00:00,2025-06-25T17:29:52+00:00,,
01JY8RHKEV7K4PFQKH60DGJ5SP,01JY8RHKDS3FABCWYR777M71SB,01JY8RHKEV7K4PFQKH60DGJ5SP,2025-06-21T08:09:11+00:00,2025-06-22T17:29:54+00:00,,
01JXW8D1T28P2XJNK63F99P9N8,01JXW8D1QQBJH8ZE71360Y4PJG,01JXW8D1T28P2XJNK63F99P9N8,2025-06-16T11:36:12+00:00,2025-06-18T01:00:00+00:00,,
01JXF65NKW3F47744EWB72AJ8Y,01JXF65NJB3DZ37F4DRXKX419W,01JXF65NKW3F47744EWB72AJ8Y,2025-06-11T09:47:05+00:00,2025-06-13T23:30:45+00:00,,
01JXMDY8AXW0DZCSH5TYBZEA3Z,01JXF65NJB3DZ37F4DRXKX419W,01JXMDY8AXW0DZCSH5TYBZEA3Z,2025-06-13T10:39:03+00:00,2025-06-13T23:30:45+00:00,,
01JX495WEZAQ18CYWFHF9JJGG2,01JX495WCXSVBH781WZBBYGMX6,01JX495WEZAQ18CYWFHF9JJGG2,2025-06-07T04:07:59+00:00,2025-06-11T01:00:15+00:00,,
01JX495Z44J5TT98PS6AZGM18W,01JX495WCXSVBH781WZBBYGMX6,01JX495Z44J5TT98PS6AZGM18W,2025-06-07T04:08:02+00:00,2025-06-11T01:00:15+00:00,,
01JWX7PYH19Q80100GJGG4QFS2,01JWX7PYEWRGTTD1TX2M53EZDJ,01JWX7PYH19Q80100GJGG4QFS2,2025-06-04T10:27:40+00:00,2025-06-05T01:00:17+00:00,,
01JWX7Q0W0DHGJ5J56SJXZG2TP,01JWX7PYEWRGTTD1TX2M53EZDJ,01JWX7Q0W0DHGJ5J56SJXZG2TP,2025-06-04T10:27:43+00:00,2025-06-05T01:00:17+00:00,,
01JWR12F2EXBNFA7B5EM4TYN63,01JWR12F1HS5V8JNB8QMBHYKM7,01JWR12F2EXBNFA7B5EM4TYN63,2025-06-02T09:55:25+00:00,2025-06-03T01:00:21+00:00,,
01JWRYKV13ZY743NRBTQYJXJGV,01JWR12F1HS5V8JNB8QMBHYKM7,01JWRYKV13ZY743NRBTQYJXJGV,2025-06-02T18:31:43+00:00,2025-06-03T01:00:21+00:00,,
01JW1HKR2GB3K0M7W50Q2CT8WC,01JW1HKR15RYSEBZCSBEE0H8PY,01JW1HKR2GB3K0M7W50Q2CT8WC,2025-05-24T16:21:57+00:00,2025-05-25T19:00:11+00:00,,
01JVT97K4WVBZNTX4B0CRRMQ6G,01JVT97K4P4S2FY1S0ZQGPSFWJ,01JVT97K4WVBZNTX4B0CRRMQ6G,2025-05-21T20:40:49+00:00,2025-05-25T17:00:45+00:00,,
01JVWJ7R5Y2EH3S3W3QF6RS4TQ,01JVWJ7R4W2MM8V2PNJYFFQKW0,01JVWJ7R5Y2EH3S3W3QF6RS4TQ,2025-05-22T17:56:40+00:00,2025-05-23T19:01:04+00:00,,
01JVW2CCB93RVDXA14F2Z5D7XC,01JVW2CC9RQBZJHF4EK7QMQ4XB,01JVW2CCB93RVDXA14F2Z5D7XC,2025-05-22T13:19:35+00:00,2025-05-23T19:00:47+00:00,,
01JV9ZEXC29FRFMCH3GYHR2KBE,01JV9ZEXAGPVK2FNR5SQEX6EXK,01JV9ZEXC29FRFMCH3GYHR2KBE,2025-05-15T12:42:12+00:00,2025-05-17T18:00:10+00:00,,
01JVD4SM1Y2DKMCQAWWQF12SE4,01JV9ZEXAGPVK2FNR5SQEX6EXK,01JVD4SM1Y2DKMCQAWWQF12SE4,2025-05-16T18:13:09+00:00,2025-05-17T18:00:10+00:00,,
01JVD4SM2BQJEDAH6ZCPA35EZT,01JV9ZEXAGPVK2FNR5SQEX6EXK,01JVD4SM2BQJEDAH6ZCPA35EZT,2025-05-16T18:13:09+00:00,2025-05-17T18:00:10+00:00,,
01JTX5KET29QY58ZBZ3CGS02MM,01JTX5KES0HWF7T25J3EHW0AF0,01JTX5KET29QY58ZBZ3CGS02MM,2025-05-10T13:19:25+00:00,2025-05-11T17:00:37+00:00,,
01JTXK9EX5CXN2HKP7YWJDF8R8,01JTX5KES0HWF7T25J3EHW0AF0,01JTXK9EX5CXN2HKP7YWJDF8R8,2025-05-10T17:18:38+00:00,2025-05-11T17:00:37+00:00,,
01JTXK9EXFJER1VW59B6J0V812,01JTX5KES0HWF7T25J3EHW0AF0,01JTXK9EXFJER1VW59B6J0V812,2025-05-10T17:18:38+00:00,2025-05-11T17:00:37+00:00,,
01JT6JV7GDNDEJ5CQBK40C0EMN,01JT6JV7G9566FP3BWNBTD0VQA,01JT6JV7GDNDEJ5CQBK40C0EMN,2025-05-01T18:48:19+00:00,2025-05-02T23:00:49+00:00,,
01JSQ5QBJ07PCE5M51WFDMPG8T,01JSQ5QBH2MB6A5GPY3SFRV6KD,01JSQ5QBJ07PCE5M51WFDMPG8T,2025-04-25T19:10:24+00:00,2025-04-29T07:59:58+00:00,,
01JSKBFFTSN0NCGJSAR41B83AS,01JSKBFFTKM8NQTVGFYQ2Z10HM,01JSKBFFTSN0NCGJSAR41B83AS,2025-04-24T07:34:00+00:00,2025-04-25T19:08:45+00:00,,
01JSCQJYBNYX86M0SGMTVVTSST,01JSCQJYBEYNSAZ6SBYJWQC3KN,01JSCQJYBNYX86M0SGMTVVTSST,2025-04-21T17:50:55+00:00,2025-04-25T08:17:46+00:00,,
01JSJ4A79T0THJBHGCNABNV64P,01JSCQJYBEYNSAZ6SBYJWQC3KN,01JSJ4A79T0THJBHGCNABNV64P,2025-04-23T20:09:33+00:00,2025-04-25T08:17:46+00:00,,
01JSFAYY5ZRAF8AJRS235AAXZ7,01JSFAYY5RTAWFQEF710F1YZHW,01JSFAYY5ZRAF8AJRS235AAXZ7,2025-04-22T18:08:00+00:00,2025-04-23T04:00:32+00:00,,
01JS11YCQA3VVB6RRX4F74H9RS,01JS11YCPNM2ATBTKEVJNCEXY8,01JS11YCQA3VVB6RRX4F74H9RS,2025-04-17T05:01:03+00:00,2025-04-19T06:00:30+00:00,,
01JRX9PKNZAZYYEE94NGJ057P3,01JRX9PKNSNTR5GJMZGPF37PWG,01JRX9PKNZAZYYEE94NGJ057P3,2025-04-15T17:59:39+00:00,2025-04-17T05:00:06+00:00,,
01JQYP78WPAKY43AZ4EHGTHV6M,01JQYP78WFJFQW9R7WS7J5G31F,01JQYP78WPAKY43AZ4EHGTHV6M,2025-04-03T20:42:00+00:00,2025-04-12T03:00:04+00:00,,
01JQYWFDYZPN3RQXGY0EMY6BFM,01JQYP78WFJFQW9R7WS7J5G31F,01JQYWFDYZPN3RQXGY0EMY6BFM,2025-04-03T22:31:19+00:00,2025-04-12T03:00:04+00:00,,
01JQYYRSHZRFERZ8QDSFXWD5PA,01JQYYRSHTMVBX2ZQ19RWKH2JW,01JQYYRSHZRFERZ8QDSFXWD5PA,2025-04-03T23:11:23+00:00,2025-04-07T00:00:32+00:00,,
01JR0YN2ENFC65CVGMM5N17C8J,01JQYYRSHTMVBX2ZQ19RWKH2JW,01JR0YN2ENFC65CVGMM5N17C8J,2025-04-04T17:47:50+00:00,2025-04-07T00:00:32+00:00,,
01JNPBKGPWBVMPJNDGR6KVRH6V,01JNPBKGP5M4DAFFAS9J58GSC6,01JNPBKGPWBVMPJNDGR6KVRH6V,2025-03-06T18:31:08+00:00,2025-03-08T05:29:54+00:00,,
01JNER6CKKGE89HTHHBTN7Q86D,01JNER6CKD66TGJ8RG76V1CRET,01JNER6CKKGE89HTHHBTN7Q86D,2025-03-03T19:37:14+00:00,2025-03-06T18:29:48+00:00,,
01JMDC5HA7T2MHTSVEXECVP0D0,01JMDC5HA22T0B4SVZBHWC6C7J,01JMDC5HA7T2MHTSVEXECVP0D0,2025-02-18T20:32:07+00:00,2025-02-22T06:00:12+00:00,,
01JM2VDK5N1G2RWD81Y3NZK161,01JM2VDK5DE1PESB2N3E19PX8B,01JM2VDK5N1G2RWD81Y3NZK161,2025-02-14T18:27:01+00:00,2025-02-15T06:00:01+00:00,,
01JKC4N3BHV0ZXZ1NYG744YBXS,01JKC4N3BCG0MWSF119G3C7GPY,01JKC4N3BHV0ZXZ1NYG744YBXS,2025-02-05T22:45:52+00:00,2025-02-14T03:59:55+00:00,,
01JKGGCFHVYEMR5MXA6JKD3W3J,01JKGGCFHNWASP4Q3G5RPSKK9N,01JKGGCFHVYEMR5MXA6JKD3W3J,2025-02-07T15:27:50+00:00,2025-02-10T07:00:10+00:00,,
01JKBYMA23NFRG2R5SGJJP4ZYC,01JKBYMA1ZKC4N8GCCJCF35XQX,01JKBYMA23NFRG2R5SGJJP4ZYC,2025-02-05T21:00:35+00:00,2025-02-08T06:59:59+00:00,,
01JJQHX18P2DE7B18E1RE2XH2T,01JJQHX18GC367NGPGG985B7EV,01JJQHX18P2DE7B18E1RE2XH2T,2025-01-28T22:53:21+00:00,2025-02-06T06:00:15+00:00,,
01JJCE26RJAPB2R8AXNZY2HPB4,01JJCE26RDX6YDDE3BNGVQJ2ZG,01JJCE26RJAPB2R8AXNZY2HPB4,2025-01-24T15:14:37+00:00,2025-01-27T06:00:04+00:00,,
01JHNHHY4W8TRTB5J7Y9YSE478,01JHNHHY4P8QDSBND2N3TE1QG0,01JHNHHY4W8TRTB5J7Y9YSE478,2025-01-15T17:53:06+00:00,2025-01-23T07:00:37+00:00,,
01JJ51Z1TS2KJBSDNWMKSJFFXW,01JHNHHY4P8QDSBND2N3TE1QG0,01JJ51Z1TS2KJBSDNWMKSJFFXW,2025-01-21T18:28:30+00:00,2025-01-23T07:00:37+00:00,,
01JHNFJEV7RA9WQYVDAPBK181T,01JHNFJEV2478HS4SRXWKAEAE6,01JHNFJEV7RA9WQYVDAPBK181T,2025-01-15T17:18:26+00:00,2025-01-19T16:23:29+00:00,,
01JH3S7S5PRSQR5XJTGMQ268NT,01JH3S7S5HTMHDPF7V3PWGVVAX,01JH3S7S5PRSQR5XJTGMQ268NT,2025-01-08T20:21:02+00:00,2025-01-11T07:00:05+00:00,,
01JGYG2A2WAQQ8PDNVYF0R8A5D,01JGYG2A2N45E1GBNQ3DHX7ZA5,01JGYG2A2WAQQ8PDNVYF0R8A5D,2025-01-06T19:04:34+00:00,2025-01-09T11:00:35+00:00,,
01JGYHCY32C1YMDWWEBKT6YXSC,01JGYG2A2N45E1GBNQ3DHX7ZA5,01JGYHCY32C1YMDWWEBKT6YXSC,2025-01-06T19:27:50+00:00,2025-01-09T11:00:35+00:00,,
01JGMDR3W8Z3XNR9738C3TBYJD,01JGMDR3W3N55N6TNXZ99YGQ69,01JGMDR3W8Z3XNR9738C3TBYJD,2025-01-02T21:11:38+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7AYPBS815KG0SSKVQXVC,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7AYPBS815KG0SSKVQXVC,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7AZ71WS2J1YXT6GYP08C,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7AZ71WS2J1YXT6GYP08C,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7AZGQYP3CNEWCT888Q1P,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7AZGQYP3CNEWCT888Q1P,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7AZS0HVWW2BR6FBVA7XY,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7AZS0HVWW2BR6FBVA7XY,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B02576HWTWMB2SE5Z3F,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B02576HWTWMB2SE5Z3F,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B0BPF7KY9WJ9JVD552N,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B0BPF7KY9WJ9JVD552N,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B0N6PVQHFN3F8X5Z7RG,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B0N6PVQHFN3F8X5Z7RG,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B0X1PSS42KG02WBKXXH,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B0X1PSS42KG02WBKXXH,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B16CVHT208FJK3J4HPG,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B16CVHT208FJK3J4HPG,2025-01-03T15:23:29+00:00,2025-01-04T14:59:51+00:00,,
01JGPC7B1FWSJNFW6P67QM2KKX,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B1FWSJNFW6P67QM2KKX,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B1RZKBGW40FCJGQ0Z3W,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B1RZKBGW40FCJGQ0Z3W,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B22WJKA52NYSD7XFX5J,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B22WJKA52NYSD7XFX5J,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B2B76F9GC5DZXJ0GTKS,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B2B76F9GC5DZXJ0GTKS,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B2M333VA03GAYRNYCMK,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B2M333VA03GAYRNYCMK,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B2XN6HAAFA1D6AHJAKY,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B2XN6HAAFA1D6AHJAKY,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B36V7373GM9A9W7N9FA,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B36V7373GM9A9W7N9FA,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B3F0GW9T6MCP6624PRH,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B3F0GW9T6MCP6624PRH,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B3RBCVFHQPWMF83ZVX3,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B3RBCVFHQPWMF83ZVX3,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B41CK56SPNT5T7GQNBQ,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B41CK56SPNT5T7GQNBQ,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B4AGMTR5BMRSJZY9VM4,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B4AGMTR5BMRSJZY9VM4,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B4JMMNNK3H6K6RJ2M0Q,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B4JMMNNK3H6K6RJ2M0Q,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B4V9VFH0HH2NY8Y53BZ,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B4V9VFH0HH2NY8Y53BZ,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGPC7B54F23T0Q7DRXSDQJSA,01JGMDR3W3N55N6TNXZ99YGQ69,01JGPC7B54F23T0Q7DRXSDQJSA,2025-01-03T15:23:29+00:00,2025-01-04T14:59:52+00:00,,
01JGCDSGNXNS0CT0RCJJ6CWWDK,01JGCDSGN63B1K32FCYWN66YFV,01JGCDSGNXNS0CT0RCJJ6CWWDK,2024-12-30T18:38:29+00:00,2024-12-30T22:00:07+00:00,,
01JF10AS1A0Q29DRHWZVCMQY2X,01JF10AS1420ATZM123YC56QCC,01JF10AS1A0Q29DRHWZVCMQY2X,2024-12-13T21:55:54+00:00,2024-12-30T22:00:03+00:00,,
01JFFWVBF4S9RR5AH31H7DJ97C,01JFFWVBEZ24AJ24BKTCX78MM4,01JFFWVBF4S9RR5AH31H7DJ97C,2024-12-19T16:43:39+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z352B06K6REC5C9GYZ9W,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z352B06K6REC5C9GYZ9W,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z35FMPQ5G4P5JQ13ZBV6,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z35FMPQ5G4P5JQ13ZBV6,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z35RKPM44NDQRXHPCR37,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z35RKPM44NDQRXHPCR37,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z36169FF88XVE02AC838,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z36169FF88XVE02AC838,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z36AYVJBCYCG6DF854CX,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z36AYVJBCYCG6DF854CX,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z36M5TNVRDXX09ET751D,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z36M5TNVRDXX09ET751D,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z36XSFNE4XSBHYA79H14,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z36XSFNE4XSBHYA79H14,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z376Y8YQNA5C5FDKF1Q7,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z376Y8YQNA5C5FDKF1Q7,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z37FZG5NR2994CZ4Q1AZ,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z37FZG5NR2994CZ4Q1AZ,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z37RQYWVSCK4QT3G7RMM,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z37RQYWVSCK4QT3G7RMM,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z381NGNTAZT7WS590SZA,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z381NGNTAZT7WS590SZA,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z38A3PRV1Q5CAH7MTSGH,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z38A3PRV1Q5CAH7MTSGH,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z38KJBP372WP44QVKWRR,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z38KJBP372WP44QVKWRR,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z38WP03G2GH19KBCDYVG,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z38WP03G2GH19KBCDYVG,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z395K7Y43F0C4X3DXC7W,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z395K7Y43F0C4X3DXC7W,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z39E2TAMQQ9H3X1PZDXT,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z39E2TAMQQ9H3X1PZDXT,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z39QXJ3T48CQJXVZZJD5,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z39QXJ3T48CQJXVZZJD5,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3A0R23SDZF9HADKF1NG,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3A0R23SDZF9HADKF1NG,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3A822W7Q5DQHB8SNGM2,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3A822W7Q5DQHB8SNGM2,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3AHZ3DJQN8AH4YXACRC,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3AHZ3DJQN8AH4YXACRC,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3AT3YKP0G017Q4F55QF,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3AT3YKP0G017Q4F55QF,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3B3XERQB34W546F8PP0,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3B3XERQB34W546F8PP0,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JFT7Z3BCBZDE7WXD69S3M1EX,01JFFWVBEZ24AJ24BKTCX78MM4,01JFT7Z3BCBZDE7WXD69S3M1EX,2024-12-23T17:10:20+00:00,2024-12-27T08:59:48+00:00,,
01JEY31HPXRXWHJGTW9YJRZFTG,01JEY31HMT818V0FRHKMK7J3S5,01JEY31HPXRXWHJGTW9YJRZFTG,2024-12-12T18:45:34+00:00,2024-12-20T09:00:32+00:00,,
01JF0Y03N976TPBTMAE53HZ1VM,01JEY31HMT818V0FRHKMK7J3S5,01JF0Y03N976TPBTMAE53HZ1VM,2024-12-13T21:15:07+00:00,2024-12-20T09:00:32+00:00,,
01JF8TV0CR448AM2ZR5SD6KEYW,01JF8TV0CJV29VTG0MJNAGP1KQ,01JF8TV0CR448AM2ZR5SD6KEYW,2024-12-16T22:53:49+00:00,2024-12-16T22:57:53+00:00,,
01JEVF7JZNZHJSR664SY3EN8YR,01JEVF7JZGAWPHK0GWYPWHXP66,01JEVF7JZNZHJSR664SY3EN8YR,2024-12-11T18:20:51+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F17W4PQ72ZR538BATYE2,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F17W4PQ72ZR538BATYE2,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F187VPYCQMWWYPRTC01K,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F187VPYCQMWWYPRTC01K,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F18E201JR3Y05WCNDE2S,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F18E201JR3Y05WCNDE2S,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F18NXQ85AGET7ZN15BSS,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F18NXQ85AGET7ZN15BSS,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F18WQJJETKEH7MJC9Y23,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F18WQJJETKEH7MJC9Y23,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F193WH8104WATDWFSR2C,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F193WH8104WATDWFSR2C,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F19AP0C8GYMSQFWAE4G6,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F19AP0C8GYMSQFWAE4G6,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F19JEB9CSEZZQJMEVBG5,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F19JEB9CSEZZQJMEVBG5,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F19SRRK49QXWNTWESSEA,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F19SRRK49QXWNTWESSEA,2024-12-12T18:17:58+00:00,2024-12-15T08:59:47+00:00,,
01JEY1F1A0N7EMMSEK4WDX45GG,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1A0N7EMMSEK4WDX45GG,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1A7DBGP6DD9NHNQ2K3E,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1A7DBGP6DD9NHNQ2K3E,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1AE8CQ30KYZ154DZ5R8,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1AE8CQ30KYZ154DZ5R8,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1ANKNJSNP3ZJ3TVP6ZF,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1ANKNJSNP3ZJ3TVP6ZF,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1AWYXHRMM7YQ2MVV9V7,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1AWYXHRMM7YQ2MVV9V7,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1B2SY7JNBWJJ2XTR8M6,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1B2SY7JNBWJJ2XTR8M6,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1B9ZE9N5HN2RWT387TS,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1B9ZE9N5HN2RWT387TS,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1BGF4N0MG82TGGPEH4K,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1BGF4N0MG82TGGPEH4K,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1BQDH86BZHBQJPKFWPP,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1BQDH86BZHBQJPKFWPP,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1BYWRYA58DVW3C87D34,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1BYWRYA58DVW3C87D34,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1C55S5R4A4E6MD95FA9,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1C55S5R4A4E6MD95FA9,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1CCAF663JQC1RD8CCV2,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1CCAF663JQC1RD8CCV2,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1CKM70DXBYN1HE79RWE,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1CKM70DXBYN1HE79RWE,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEY1F1CT18RDMV81BYQP9NAC,01JEVF7JZGAWPHK0GWYPWHXP66,01JEY1F1CT18RDMV81BYQP9NAC,2024-12-12T18:17:58+00:00,2024-12-15T08:59:48+00:00,,
01JEEJ4PRA6DKV6TTJ6B8FAF7P,01JEEJ4PR2G15W93M0JMSDNA7V,01JEEJ4PRA6DKV6TTJ6B8FAF7P,2024-12-06T18:01:35+00:00,2024-12-11T00:29:57+00:00,,
01JEEA2DHFT31N9P15A3XQYWB9,01JEEA2DHA1K92JBA6A1DWH300,01JEEA2DHFT31N9P15A3XQYWB9,2024-12-06T15:40:31+00:00,2024-12-06T21:00:20+00:00,,
01JDNDEW9Z1DKVK5ZQGB13MMY7,01JDNDEW9T5FNV00YZBPX8GN4Y,01JDNDEW9Z1DKVK5ZQGB13MMY7,2024-11-26T23:38:44+00:00,2024-12-04T02:00:02+00:00,,
01JDMX88HPHM65ZR54K0JQP9FF,01JDMX88GT11YHSXYAXEEM3QPE,01JDMX88HPHM65ZR54K0JQP9FF,2024-11-26T18:55:30+00:00,2024-12-02T19:00:28+00:00,,
01JDMHEJ0PX3PM72N571KXWA3C,01JDMHEJ0GYWS9VVCB5WEJZ52M,01JDMHEJ0PX3PM72N571KXWA3C,2024-11-26T15:29:14+00:00,2024-11-29T22:00:12+00:00,,
01JD5G8CZVJ6FEGKCV2NEJ74XS,01JD5G8CZPS3WF6C1R0909AYV3,01JD5G8CZVJ6FEGKCV2NEJ74XS,2024-11-20T19:19:47+00:00,2024-11-22T22:17:14+00:00,,
01JD5GJF9DFA9PPPK0NDPVT8WV,01JD5GJF8DTGP5Y38YDFWSQMFN,01JD5GJF9DFA9PPPK0NDPVT8WV,2024-11-20T19:25:17+00:00,2024-11-22T03:29:48+00:00,,
01JD5H6Y3M0SWVFM0JDM0N1575,01JD5H6Y2RNGYYY56N8FKN880N,01JD5H6Y3M0SWVFM0JDM0N1575,2024-11-20T19:36:28+00:00,2024-11-22T03:00:18+00:00,,
01JD5HKGHXP8G51P9RXFBZXDZQ,01JD5HKGH08HS1AJFA0C6X3BVG,01JD5HKGHXP8G51P9RXFBZXDZQ,2024-11-20T19:43:20+00:00,2024-11-22T03:00:08+00:00,,
01JCPFMDRM13T5DV1Z2AXZSGYB,01JCPFMDQNQE0BVQX5DTXMPSQ0,01JCPFMDRM13T5DV1Z2AXZSGYB,2024-11-14T23:20:16+00:00,2024-11-21T03:44:49+00:00,,
01JBZ6Q1TP47QP53V7HCDZ8YSX,01JBZ6Q1TFJY6032Z4GXNQ5Y0N,01JBZ6Q1TP47QP53V7HCDZ8YSX,2024-11-05T22:21:53+00:00,2024-11-15T20:59:52+00:00,,
01JCE3BY6GM4CV9AH9BN50RZJ4,01JCE3BY6AET4X828V68CBFT53,01JCE3BY6GM4CV9AH9BN50RZJ4,2024-11-11T17:11:59+00:00,2024-11-12T23:32:10+00:00,,
01JCEBTCB8AGT81HGK075HVY2Y,01JCEBTCA89Q43KTX9C93F3PRT,01JCEBTCB8AGT81HGK075HVY2Y,2024-11-11T19:39:41+00:00,2024-11-12T03:44:57+00:00,,
01JCEC56CV3ARR5FVRPMV8E3VH,01JCEC56BRDWYHFP67506VWXHT,01JCEC56CV3ARR5FVRPMV8E3VH,2024-11-11T19:45:36+00:00,2024-11-12T03:44:56+00:00,,
01JC6TXBZ36NJRBKAAY1GXAB0X,01JC6TXBYA9XMGE9NB83EE2PPP,01JC6TXBZ36NJRBKAAY1GXAB0X,2024-11-08T21:29:32+00:00,2024-11-12T03:44:56+00:00,,
01JCEC2W7BC3NSTSW4RK153KEV,01JCEC2W69H0SZ9XBDCKJFV033,01JCEC2W7BC3NSTSW4RK153KEV,2024-11-11T19:44:20+00:00,2024-11-12T03:44:54+00:00,,
01JCEC0SDQ5ZVPW2ZND88S7YYF,01JCEC0SCR7HMXY0NG4AWGHXPJ,01JCEC0SDQ5ZVPW2ZND88S7YYF,2024-11-11T19:43:11+00:00,2024-11-12T03:44:54+00:00,,
01JC6S7PRY4KC7W6KREGBR831Q,01JC6S7PR03BXXNMZ20RK7J5ES,01JC6S7PRY4KC7W6KREGBR831Q,2024-11-08T21:00:14+00:00,2024-11-11T19:38:46+00:00,,
01JC6TD5BF6TRC5SJJVH1WQVH5,01JC6TD5AGVE6CMPQQ3NXFDA8M,01JC6TD5BF6TRC5SJJVH1WQVH5,2024-11-08T21:20:41+00:00,2024-11-11T19:38:42+00:00,,
01JC6SWTGXN5VHWC9HJ62BZQDA,01JC6SWTFX66EE288FYHK6AAFW,01JC6SWTGXN5VHWC9HJ62BZQDA,2024-11-08T21:11:46+00:00,2024-11-11T19:38:38+00:00,,
01JC6GZKKEG7DX8RPKRSK0F1SA,01JC6GZKJJR6CYM88HWE42VNHN,01JC6GZKKEG7DX8RPKRSK0F1SA,2024-11-08T18:36:00+00:00,2024-11-11T19:38:33+00:00,,
01JC67CXJYS89BTYS80VZP1PQJ,01JC67CXJR45HGKHF8AGNBKKZP,01JC67CXJYS89BTYS80VZP1PQJ,2024-11-08T15:48:30+00:00,2024-11-11T16:09:31+00:00,,
01JBW30GBCYRDQS5Z9M9KC0M8Q,01JBW30GADAH1ZQ4GXF4XE15SV,01JBW30GBCYRDQS5Z9M9KC0M8Q,2024-11-04T17:19:25+00:00,2024-11-06T21:29:53+00:00,,
01JBHMAPRCFDCX2B00MK993NRC,01JBHMAPQJFNT3BCEPQ73VSH8B,01JBHMAPRCFDCX2B00MK993NRC,2024-10-31T15:50:26+00:00,2024-11-01T15:17:08+00:00,,
01JBEYBCGPYH3KDE4QM6DC2KHZ,01JBEYBCFQQ8TBAQA5C8H95P5A,01JBEYBCGPYH3KDE4QM6DC2KHZ,2024-10-30T14:47:51+00:00,2024-10-31T01:00:03+00:00,,
01JBCFAM1Z3XFYVJYVF34CR1K5,01JBCFAM1SCJDVGBQBYFMPF9SX,01JBCFAM1Z3XFYVJYVF34CR1K5,2024-10-29T15:46:49+00:00,2024-10-30T14:47:24+00:00,,
01JB9X49K8ZAPEH2VHG4TD7ZDH,01JB9X49K2F1DJSAMRKCSK13JF,01JB9X49K8ZAPEH2VHG4TD7ZDH,2024-10-28T15:50:18+00:00,2024-10-29T19:59:49+00:00,,
01JB27CDW2C41GY472BMWRKB24,01JB27CDVWSAT21XN0MF7FT6MK,01JB27CDW2C41GY472BMWRKB24,2024-10-25T16:15:35+00:00,2024-10-26T20:00:19+00:00,,
01JAV44Q5682VT2ADG9MPBGHCW,01JAV44Q51F8T6EM1YCG8N46XZ,01JAV44Q5682VT2ADG9MPBGHCW,2024-10-22T22:04:15+00:00,2024-10-24T02:14:51+00:00,,
01JAB5JJM09G6CDDTJDVSBVYSX,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JAB5JJM09G6CDDTJDVSBVYSX,2024-10-16T17:21:27+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3PMPHCFJWYSDY10H8F1,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3PMPHCFJWYSDY10H8F1,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3Q3KFC9PMNPR374EZZC,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3Q3KFC9PMNPR374EZZC,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3QCCRNX20JYYKY8HWWC,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3QCCRNX20JYYKY8HWWC,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3QN0XG2XWFC9NYMSVA6,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3QN0XG2XWFC9NYMSVA6,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3QYVYMWBE6FP1DBFYPX,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3QYVYMWBE6FP1DBFYPX,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3R95NK3HQWGQ7P3T8EH,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3R95NK3HQWGQ7P3T8EH,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
01JADDQ3RJKMFSJH6B9AWKF4K1,01JAB5JJKVXR8ZGVWJ3HE7E3YA,01JADDQ3RJKMFSJH6B9AWKF4K1,2024-10-17T14:22:13+00:00,2024-10-19T07:00:31+00:00,,
`,
    campaign_data: `Date,Campaign Message ID,Campaign Message Name,Send Date,Send Time,Total Recipients,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Apple Privacy Opens,Unique Apple Privacy Opens,Unique Clicks,Total Clicks,Total Unsubscribes,Unique Unsubscribes,Spam Complaints,Bounces,Total Placed Order,Tags,Subject,Preview Text,List,Excluded List,Day of Week,Campaign Message Channel
Apr 16 2025 - Oct 16 2025,01K77K3VWQKVN0PEH4QBZTXEGM,October 14th: Pourigami Highlight,2025-10-14,06:00 PM,124817,0.56127,0.00625,0.00227,0.00167,6e-05,88483.0,69939.0,67371.0,56388.0,779,929,283,283,7.0,208.0,22,,"Coffee, reimagined - meet new Pourigami","The most compact, elevated way to brew.",180 Days Engaged RIQ,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01K74X9FW93XHBNZN06YFJ58K1,October 10th: Holiday 2025  October Promotion,2025-10-11,10:00 AM,131712,0.63188,0.00794,0.00279,0.005,5e-05,108968.0,82811.0,85704.0,68292.0,1040,1859,365,365,6.0,658.0,39,,Reminder: free 🎁 with your purchase this month,Shop now before they’re gone.,"RIQ RFM Champions, RIQ RFM At Risk, 60 Days Engaged RIQ, [RFM] - At Risk or Needs Attention, RIQ RFM Loyalists, RIQ RFM Recent, RIQ RFM Needs Attention","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Saturday,Email
Apr 16 2025 - Oct 16 2025,01K71XE5K0QB65RTE334BNDCB3,October 8th: Fall Colors,2025-10-08,12:00 PM,132521,0.62043,0.00473,0.00337,0.00679,5e-05,109677.0,81662.0,84886.0,66468.0,623,841,444,444,6.0,900.0,16,,Sip Into Fall 🍁,"New colors, same MiiR vibe.","RIQ RFM Champions, RIQ RFM At Risk, 60 Days Engaged RIQ, [RFM] - At Risk or Needs Attention, RIQ RFM Loyalists, RIQ RFM Recent, RIQ RFM Needs Attention","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K6D4GK0MF9185V6TM6W0A9Q1,October 1st: Holiday 2025 October Promotion,2025-10-01,06:00 PM,134557,0.61628,0.00687,0.00406,0.0054,9e-05,115655.0,82477.0,89274.0,67445.0,919,1085,543,543,12.0,726.0,34,,"{{ person.first_name|title|default:'MiiR Crew' }}, your holiday 🎁 gift is waiting",Free MiiR in October!,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K663A96J61ZFVJJTJSWJDCBB,September 29th: Salmon Sisters X Kaladi Brothers,2025-09-30,06:00 PM,133481,0.66077,0.02256,0.00398,0.01579,6e-05,122062.0,86807.0,93848.0,70594.0,2964,4443,523,523,8.0,2108.0,32,,A taste of Alaska: MiiR X Salmon Sisters & Kaladi Brothers 🌊,,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01K60738QQKCHYJN2PBVA7RZFE,September 25th: 360 Lid Highlight,2025-09-25,11:00 AM,128474,0.55847,0.00779,0.00328,0.00855,0.00013,102945.0,71135.0,78932.0,57695.0,992,1203,418,418,16.0,1099.0,58,,One Lid. Four Ways to Drink.,Upgrade your ritual with the all-new 360 Lid.,"RIQ RFM Champions, RIQ RFM Recents + New Purchasers, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, RIQ RFM Recent + Received Email Last 30 Days, 360 Lid Interested RIQ, 180 Days Engaged RIQ, RIQ RFM Loyalists, RIQ RFM Recent Opened Email Last 30 Days","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Thursday,Email
Apr 16 2025 - Oct 16 2025,01K5KVCRFKQZYEJD66JT0CT6K7,September 23rd: Airlock Coffee Canister Highlight,2025-09-23,10:00 AM,134421,0.54775,0.00442,0.00314,0.00399,0.0001,105209.0,73336.0,80716.0,59030.0,592,765,421,421,14.0,536.0,25,RIQ,"Keep Your Coffee Fresh, The Smart Way 🥤",Our newest innovation keeps your coffee fresher for longer.,"RIQ RFM Champions, RIQ RFM Recents + New Purchasers, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, RIQ RFM Recent + Received Email Last 30 Days, Airlock Coffee Canister Interested RIQ, RIQ RFM Loyalists, 120 Days Engaged RIQ, RIQ RFM Recent Opened Email Last 30 Days","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01K5H7REW4W637RWX5447JYQN1,September 20th: Hand Grinder,2025-09-20,10:00 AM,135173,0.54927,0.00993,0.00349,0.00448,7e-05,108238.0,73914.0,82386.0,59352.0,1336,4090,469,469,10.0,606.0,21,"promocode, promo",Meet the Hand Grinder!,"Engineered for consistency, crafted for coffee lovers.","RIQ RFM Champions, RIQ RFM Recents + New Purchasers, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, 60 Days Engaged RIQ, RIQ RFM Recent + Received Email Last 30 Days, RIQ RFM Loyalists, RIQ RFM Recent Opened Email Last 30 Days","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Saturday,Email
Apr 16 2025 - Oct 16 2025,01K5C8QPDW374JST7BTVS3SWR1,September 17th: Coffee Product Innovation (clone),2025-09-17,10:00 AM,139283,0.61109,0.01322,0.00435,0.02591,0.0001,122235.0,82909.0,91422.0,65921.0,1793,2749,590,590,13.0,3609.0,48,"promocode, promo","Hey {{ first_name|default:'there' }}, Your feedback just became better gear!","Newly designed Pourigami, 360 Traveler, and more.",RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K4QNJZDS1FRPYM55MCHN4NK1,September 13th: Winback Campaign 2,2025-09-13,09:00 AM,4004,0.06744,0.00727,0.00175,0.00375,0.0,339.0,269.0,81.0,75.0,29,34,8,7,0.0,15.0,1,"promocode, promo","Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁",,"365 Days Unengaged Winback 2 RIQ, MiiR_180_Days_Unengaged_Winback 2 RIQ","tag_ unengaged sunset user [Suppressed Sept 24], Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Saturday,Email
Apr 16 2025 - Oct 16 2025,01K4Q1E74V6WYEVRA1GN0NQ2YR,September 10th: Winback Campaign,2025-09-10,10:00 AM,3857,0.0666,0.00832,0.00416,0.00337,0.00052,318.0,256.0,70.0,62.0,32,39,16,16,2.0,13.0,2,RIQ,"Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁",,"365 Days Unengaged Winback 1 RIQ, MiiR_180_Days_Unengaged_Winback 1 RIQ","tag_ unengaged sunset user [Suppressed Sept 24], Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K47KYSE91ZBX3GZX7QW0YVJ1,September 3rd: Labor Day Reminder,2025-09-03,06:00 PM,137511,0.55001,0.00669,0.00577,0.01556,0.00013,109671.0,74455.0,83995.0,60386.0,906,1117,792,781,18.0,2140.0,137,"promocode, promo","Hey {{ first_name|default:'there' }}, Don’t Miss Free Shipping!","Enjoy durable, thoughtfully designed MiiR gear shipped free.",RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K3RHYT81R2V2YYQCHM616BEC,August 31st: Labor Day Sale,2025-08-31,10:00 AM,137357,0.60191,0.0058,0.00658,0.00254,0.00011,119575.0,82466.0,92791.0,67618.0,795,1083,915,902,15.0,349.0,92,"promocode, promo",Labor Day Win 🎉,Free Shipping + New Arrivals,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Sunday,Email
Apr 16 2025 - Oct 16 2025,01K3R2BZ6KR79ZRXNV1C4SCG3W,August 29th: Cascara Launch,2025-08-29,12:00 PM,138999,0.57122,0.00634,0.00588,0.01026,0.00017,114918.0,78584.0,88215.0,63792.0,872,1049,820,809,23.0,1426.0,46,"promocode, promo",Cascara Red is Here Again! 🌟,Our classic colorway on 12oz & 20oz favorites.,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Friday,Email
Apr 16 2025 - Oct 16 2025,01K3GEPXSG0CKRSRT4WP0S09B1,August 26th: International Dog Days,2025-08-26,06:00 PM,138985,0.55959,0.00403,0.00643,0.01158,0.00019,112110.0,76874.0,86373.0,62294.0,554,670,897,883,26.0,1609.0,19,"promocode, promo",Celebrate your pooch today!,Free engraving on our dog bowls.,"RIQ RFM Champions, RIQ RFM At Risk, Loyals RIQ Definition, RIQ Need Attention Users Not Opened Email, 180 Days Engaged RIQ, RIQ RFM Loyalists, RIQ RFM Recent, Dog Bowl Interest Groups RIQ","tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Placed order 10 days, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01K398EE7GTNEQDZ0X8P412RGY,August 24th: Eco-Stylist Silver Status,2025-08-24,10:00 AM,141437,0.61699,0.00362,0.00845,0.0115,0.00019,124162.0,86262.0,95925.0,70231.0,506,697,1198,1181,26.0,1627.0,30,"promocode, promo",MiiR x Eco Stylist: Raising the Standard.,A milestone in sustainable design worth celebrating.,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Sunday,Email
Apr 16 2025 - Oct 16 2025,01K31CW60Q90VT4E5WMRCS000C,August 20th: Brand Ambassador Campaign,2025-08-20,07:00 PM,148275,0.65531,0.01245,0.00917,0.0156,0.00024,142053.0,95651.0,104637.0,76190.0,1817,2227,1364,1338,35.0,2313.0,37,"promocode, promo",You're Invited!,Apply to be a MiiR Ambassador 🌍,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K2HCG68SJSQX4WK7CXY4JD7C,August 14th: LTO Party Collection,2025-08-14,06:00 PM,155467,0.56625,0.01296,0.01,0.04103,0.00018,122866.0,84421.0,94119.0,68721.0,1932,2318,1519,1491,27.0,6379.0,50,"promocode, promo",Your invitation to celebrate. Every. Single. Day.,Introducing two new colorways that inspire celebration.,RIQ All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Highly Unengaged Segments RIQ, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Thursday,Email
Apr 16 2025 - Oct 16 2025,01K22QGMPK9YRP4AZQPDHTYG9N,Aug 8: Product Spotlight: 360 Traveler,2025-08-08,06:00 PM,73406,0.55949,0.00814,0.0093,0.00095,0.0001,60510.0,41031.0,46678.0,33486.0,597,748,692,682,7.0,70.0,20,"promocode, promo",360 Traveler: Sip From Every Side,"Hot beverages, cold drinks, 360° sipping.","RIQ RFM Champions, 180 - days - 360 interest based, 60 Days Engaged RIQ, RIQ RFM Loyalists","15 day exclude- 360 traveller, tag_ unengaged sunset user [Suppressed Sept 24], Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Friday,Email
Apr 16 2025 - Oct 16 2025,01K1GCAEGYMCFC1R749AF4A9GT,Aug 3: Back to school PROMO,2025-08-03,06:00 PM,89525,0.53653,0.00549,0.00786,0.00637,0.00012,69363.0,47727.0,54155.0,39252.0,488,636,699,699,11.0,570.0,32,"promocode, promo",Free etching on your favorite MiiR!,Make your gear stand out with a personal touch.,MiiR - All Subscribers,"tag_ unengaged sunset user [Suppressed Sept 24], Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27), Placed order 20 days (clone)",Sunday,Email
Apr 16 2025 - Oct 16 2025,01K1B3WH3PBA7KER037FCVJMS3,July 30: MIIR Favorites,2025-07-30,06:00 PM,120603,0.56673,0.00486,0.00796,0.00109,0.00016,99537.0,68275.0,77572.0,56082.0,586,725,973,959,19.0,132.0,18,"promocode, promo",Your Next Daily Essential: See the Reviews!,Explore MiiR's everyday favorites and read authentic customer stories.,120 Days Engaged RIQ,"Placed order 10 days, Bounced emails (Suppressed June 27)",Wednesday,Email
Apr 16 2025 - Oct 16 2025,01K0XXTJ13R2FMX2AKHE3YTKVR,July 25: Product Spotlight: New Standard Carafe,2025-07-25,06:00 PM,125245,0.55185,0.00611,0.00693,0.00146,0.00015,101212.0,69016.0,78315.0,56404.0,764,966,873,867,19.0,183.0,23,"promocode, promo",Meet the New Standard in Coffee Gear.,Durable stainless steel and precise pour-over brewing. No mess. No cracks.,180 Days Engaged RIQ,"Placed order 10 days, Bounced emails (Suppressed June 27)",Friday,Email
Apr 16 2025 - Oct 16 2025,01K0H52KCCDKA6ECRWAZPJJJRP,July 21: Generosity Driven,2025-07-21,06:00 PM,121357,0.57617,0.00214,0.00694,0.00138,4e-05,102276.0,69825.0,78370.0,56629.0,259,362,852,841,5.0,168.0,21,"promocode, promo",Products with Purpose.,Details about your GiveCode™.,120 Days Engaged RIQ,Placed order 10 days,Monday,Email
Apr 16 2025 - Oct 16 2025,01K0CJXPT74M081DR6KGTN65WN,June 18: Carryology,2025-07-18,10:30 AM,160023,0.46177,0.00785,0.00684,0.01455,0.00015,106771.0,72818.0,80744.0,58255.0,1238,1572,1094,1078,24.0,2329.0,36,"promocode, promo",MiiR x Carryology Bottles are Here!,Your hydration routine just got an upgrade.,"MiiR - All Subscribers, RIQ All Subscribers","Placed order 10 days, Bounced emails (Suppressed June 27)",Friday,Email
Apr 16 2025 - Oct 16 2025,01K04K0ET03SQ63F2ZEDV6YTWS,June 15: Product Engraving,2025-07-15,06:00 PM,125516,0.55072,0.0039,0.00648,0.00095,0.00016,101146.0,69059.0,78871.0,56920.0,489,596,821,813,20.0,119.0,34,"promocode, promo",Make It Personal: Engrave Your MiiR Gear.,Customization made simple for gifts & teams.,"180 Days Engaged RIQ, Personalize","Placed order 10 days, Bounced emails (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01JZQ6JCA9YWFZ2R1KEGB28EQK,June 9:Top Picks for Summer Adventures,2025-07-09,06:00 PM,159604,0.46217,0.00499,0.00706,0.00987,0.00027,106201.0,73037.0,81818.0,59352.0,789,2032,1153,1116,42.0,1575.0,39,"promocode, promo",Adventure-Ready Gear for Every Summer Plan.,"MiiR favorites for hikes, road trips, beach days, and more.","MiiR - All Subscribers, RIQ All Subscribers",Placed order 10 days,Wednesday,Email
Apr 16 2025 - Oct 16 2025,01JZ394GQM1JWQKS5HQRXN2007,July 2: BOGO Promo – Pourigami + Camp Cup,2025-07-02,10:30 AM,159306,0.48782,0.00683,0.00925,0.01765,0.00033,110970.0,76342.0,83190.0,60715.0,1069,2051,1482,1447,52.0,2811.0,50,"promocode, promo",Your New Favorite Brew Duo (With a Gift Inside),"Grab the Pourigami, get the Camp Cup free.","MiiR - All Subscribers, RIQ All Subscribers",Placed order 10 days,Wednesday,Email
Apr 16 2025 - Oct 16 2025,01JYRHATXRX8FW7HA88HGE6MWR,June 28th: Customer Testimony,2025-06-28,10:31 AM,114465,0.60929,0.00352,0.00599,0.00122,0.00022,101095.0,69657.0,79232.0,57622.0,402,525,700,685,25.0,140.0,25,"promocode, promo",Why Thousands Choose MiiR,These real experiences say it better than we ever could.,120 Days Engaged RIQ,Placed order 10 days,Saturday,Email
Apr 16 2025 - Oct 16 2025,01JYGVZZKT2MNHYWZYQ8WKFAT6,June 25th: Hydration Myths Busted,2025-06-25,10:30 AM,115503,0.58565,0.00312,0.00564,0.00292,7e-05,97916.0,67447.0,76256.0,55327.0,359,450,662,650,8.0,337.0,15,"promocode, promo",Let’s bust some hydration myths.,"Turns out, your thirst doesn’t tell the full story.",120 Days Engaged RIQ,Placed order 10 days,Wednesday,Email
Apr 16 2025 - Oct 16 2025,01JY8RHKDS3FABCWYR777M71SB,June 22nd: Blog Highlight,2025-06-22,10:30 AM,116465,0.63233,0.00711,0.00563,0.00292,9e-05,107157.0,73429.0,82510.0,60101.0,826,1074,667,654,10.0,340.0,24,"promocode, promo","Turkish-style Cold Brew? Yes, Please.",Plus a complimentary cold brew filter with every Tomo purchase.,120 Days Engaged RIQ,Placed order 10 days,Sunday,Email
Apr 16 2025 - Oct 16 2025,01JXW8D1QQBJH8ZE71360Y4PJG,June 17th: National Camping Month,2025-06-17,06:00 PM,116898,0.59987,0.00461,0.00529,0.00276,0.00019,101612.0,69930.0,79487.0,57744.0,537,751,622,617,22.0,323.0,13,"promocode, promo",Celebrate the outdoors!,Adventure ready gear built for camping.,120 Days Engaged RIQ,Placed order 10 days,Tuesday,Email
Apr 16 2025 - Oct 16 2025,01JXF65NJB3DZ37F4DRXKX419W,June 13th: Impact Report 2024,2025-06-13,10:30 AM,161198,0.58478,0.0049,0.00633,0.01838,0.00021,132529.0,92533.0,102467.0,75734.0,776,924,1023,1002,33.0,2963.0,42,"promocode, promo","Reflecting on Impact, Together.",,"MiiR - All Subscribers, RIQ All Subscribers",,Friday,Email
Apr 16 2025 - Oct 16 2025,01JX495WCXSVBH781WZBBYGMX6,June 10th: Father’s Day Gifting Guide,2025-06-10,09:00 AM,111391,0.6041,0.00603,0.00492,0.00314,7e-05,97427.0,67080.0,75008.0,54785.0,670,999,565,546,8.0,350.0,22,"promocode, promo",Gifts They Will Actually Use And Love!,"From morning coffee to weekend rides—functional, thoughtful, built to last.",120 Days Engaged RIQ,Placed order 10 days,Tuesday,Email
Apr 16 2025 - Oct 16 2025,01JWX7PYEWRGTTD1TX2M53EZDJ,June 4th: Altitude Blue Launch,2025-06-04,01:00 PM,157879,0.52718,0.00831,0.00592,0.02021,0.00021,119178.0,81549.0,88537.0,64664.0,1285,1964,932,915,33.0,3190.0,46,"promocode, promo",A New Hue Has Arrived,Introducing Altitude Blue—our latest limited-edition color is here.,"MiiR - All Subscribers, RIQ All Subscribers",Placed order 10 days,Wednesday,Email
Apr 16 2025 - Oct 16 2025,01JWR12F1HS5V8JNB8QMBHYKM7,June 2nd: Tomo + Cold brew filter,2025-06-02,12:00 PM,114794,0.66802,0.0063,0.00668,0.00338,9e-05,112028.0,76425.0,85952.0,62421.0,721,868,778,764,10.0,388.0,46,"promocode, promo",Sip the Season,Free Cold Brew Filter with every Tomo.,RIQ 90 days engaged,Placed order 10 days,Monday,Email
Apr 16 2025 - Oct 16 2025,01JW1HKR15RYSEBZCSBEE0H8PY,May 25th: Free engraving PROMO,2025-05-25,12:00 PM,114620,0.65623,0.00783,0.00633,0.00305,0.00021,109746.0,74987.0,85406.0,61881.0,895,1212,735,723,24.0,350.0,43,"promocode, promo","Custom Gear, On Us.","Engrave your design, name, or message for free this month only.",RIQ 90 days engaged,Placed order 10 days,Sunday,Email
Apr 16 2025 - Oct 16 2025,01JVT97K4P4S2FY1S0ZQGPSFWJ,Win back promo - 1 year lapsed customers,2025-05-25,10:00 AM,7973,0.67655,0.02826,0.0044,0.00151,0.0,8685.0,5386.0,4981.0,3392.0,225,477,36,35,0.0,12.0,4,,You deserve better : save 15% this week only.,,Lapsed customers _ 1 year _  email,Reputation Repair Audience,Sunday,Email
Apr 16 2025 - Oct 16 2025,01JVWJ7R4W2MM8V2PNJYFFQKW0,23 May: Product Spotlight - Chug Lid Email #3,2025-05-23,12:00 PM,12,0.83333,0.33333,0.0,0.0,0.0,20.0,10.0,9.0,6.0,4,12,0,0,0.0,0.0,3,"promocode, promo",We heard you! Let us make it right with the redesigned Leakproof Chug Lid.,,chug lid email #3,Reputation Repair Audience,Friday,Email
Apr 16 2025 - Oct 16 2025,01JVW2CC9RQBZJHF4EK7QMQ4XB,23 May: Product Spotlight - Chug Lid Email#1,2025-05-23,12:00 PM,101160,0.56613,0.00942,0.00606,0.02353,0.00046,81233.0,55922.0,61079.0,44867.0,931,1270,605,599,45.0,2380.0,26,"promocode, promo",Meet Your New Favorite Lid,The new Chug Lid delivers big hydration with zero leaks.,chug lid email#1 segment,chug lid email #3,Friday,Email
Apr 16 2025 - Oct 16 2025,01JV9ZEXAGPVK2FNR5SQEX6EXK,"16 May: Hydration goals, Summer Ready",2025-05-16,07:00 PM,43868,0.65106,0.0091,0.01053,0.00597,0.00039,44635.0,28390.0,25597.0,17265.0,397,519,469,459,17.0,262.0,19,"promocode, promo",Stay Cool. Sip Smarter. Summer Starts Here.,"Summer-ready sippers, hydration tips, and gear you’ll carry everywhere.",RIQ 90 days engaged,"Placed order 10 days, Reputation Repair Audience",Friday,Email
Apr 16 2025 - Oct 16 2025,01JTX5KES0HWF7T25J3EHW0AF0,10 May: Customer Favorites in Focus,2025-05-10,07:00 PM,32306,0.59852,0.00831,0.00499,0.0018,0.00016,30634.0,19301.0,18445.0,12180.0,268,383,161,161,5.0,58.0,28,"promocode, promo",Fan Favorites You’ll Reach for Every Day,Discover why these bottles are topping customer carts—hydration never looked so good.,MiiR - All Subscribers,"Reputation Repair Audience, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Saturday,Email
Apr 16 2025 - Oct 16 2025,01JT6JV7G9566FP3BWNBTD0VQA,May 2025 | Free Etching promo,2025-05-02,12:00 PM,30316,0.59719,0.00892,0.00482,0.00112,3e-05,28193.0,18084.0,16286.0,11195.0,270,391,148,146,1.0,34.0,22,"promocode, promo",Choose your canvas!,"Free etching on all MiiR, all month long.",MiiR - All Subscribers,"Reputation Repair Audience, Bounced emails (Suppressed June 27), MiiR - Never Engaged (Email) (Suppressed June 27)",Friday,Email
Apr 16 2025 - Oct 16 2025,01JSQ5QBH2MB6A5GPY3SFRV6KD,Q2 2025 | $45 Free Shipping Reminder (clone),2025-04-27,09:00 PM,1143,0.70691,0.02012,0.02362,0.0,0.0,1317.0,808.0,878.0,602.0,23,40,27,27,0.0,0.0,3,"shipping, Email, promo, Free Shipping, Smart Send Time",Final days to unlock free shipping!,,Opened or active on site _ 30 days _ no order,"DO NOT SEND EMAIL _ UNSUBSCRIBED, MiiR - Never Engaged (Email) (Suppressed June 27)",Sunday,Email
Apr 16 2025 - Oct 16 2025,01JSCQJYBEYNSAZ6SBYJWQC3KN,Q2 25 Sipper Straw Bottle Launch,2025-04-24,07:15 PM,29831,0.65745,0.01711,0.00564,0.00094,7e-05,30245.0,19594.0,16604.0,11505.0,510,651,168,168,2.0,28.0,23,new product,It’s here!,Meet the Sipper Straw Bottle.,MiiR - All Subscribers,"Reputation Repair Audience, MiiR - Never Engaged (Email) (Suppressed June 27)",Thursday,Email
Apr 16 2025 - Oct 16 2025,01JSFAYY5RTAWFQEF710F1YZHW,Earth day 2025 | Takeback video,2025-04-22,05:00 PM,29719,0.67315,0.0059,0.00431,0.00111,3e-05,31267.0,19983.0,17478.0,11854.0,175,313,130,128,1.0,33.0,21,,Stainless Steel Recycling,A note to all Earthlings about our shared responsibility.,MiiR - All Subscribers,"Reputation Repair Audience, MiiR - Never Engaged (Email) (Suppressed June 27)",Tuesday,Email
Apr 16 2025 - Oct 16 2025,01JS11YCPNM2ATBTKEVJNCEXY8,"[Follow-up] Win back Campaign - Apr 16, 2025",2025-04-18,07:00 PM,9038,0.26569,0.00819,0.00399,0.00055,0.00011,3254.0,2400.0,1176.0,874.0,74,243,37,36,1.0,5.0,3,,Quench Your Thirst for $20! 💧,Check out our favorite summer accessories.,"[Engaged non-openers] Win back Campaign - Apr 16, 2025",,Friday,Email
Apr 16 2025 - Oct 16 2025,01JRX9PKNSNTR5GJMZGPF37PWG,"Win back Campaign - Apr 16, 2025",2025-04-16,07:00 PM,240657,0.3397,0.00753,0.00767,0.02151,0.00134,115373.0,79992.0,85323.0,62092.0,1773,2769,1859,1805,315.0,5176.0,38,,Deals under $20,Check out our favorite summer accessories.,Win back _ no visit or puchase 90 days,"DO NOT SEND EMAIL _ UNSUBSCRIBED, MiiR - Never Engaged (Email) (Suppressed June 27)",Wednesday,Email
`,
    flow_data: `Date,Flow ID,Flow Name,Message ID,Message Name,Message Channel,Status,Total Recipients,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Apple Privacy Opens,Unique Apple Privacy Opens,Total Clicks,Unique Clicks,Total Unsubscribes,Spam Complaints,Unique Unsubscribes,Bounces,Total Placed Order,Tags,Message Status
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,TReC9i,Copy of Email #2 - NO SMS,Email,Manual,97,0.53125,0.0,0.0,0.01031,0.0,87.0,51.0,64.0,44.0,0,0,0,0.0,0,1.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,TedzwF,Copy of Email #3-SMS-15%,Email,Manual,87,0.55814,0.03488,0.0,0.01149,0.0,89.0,48.0,65.0,42.0,4,3,0,0.0,0,1.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,RYbuhr,Email #1 - old customer,Email,Manual,104,0.67308,0.01923,0.00962,0.0,0.0,119.0,70.0,79.0,53.0,2,2,1,0.0,1,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,Vz3fip,Email #2 -Old customer,Email,Manual,81,0.67901,0.02469,0.0,0.0,0.0,87.0,55.0,59.0,39.0,2,2,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,XwHDvE,Email #2 -SMS,Email,Manual,26,0.38462,0.03846,0.0,0.0,0.0,20.0,10.0,11.0,8.0,1,1,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,WTGAT3,Email #3-SMS-18%,Email,Manual,23,0.43478,0.04348,0.0,0.0,0.0,17.0,10.0,11.0,8.0,2,1,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,T9Ajbh,Email #3-old customer,Email,Manual,70,0.64286,0.01429,0.0,0.0,0.0,71.0,45.0,56.0,37.0,1,1,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,UpCqqx,Email #4 -sms-15 %,Email,Manual,74,0.63514,0.01351,0.0,0.0,0.0,116.0,47.0,64.0,36.0,3,1,0,0.0,0,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,UufEKV,Email #4 -sms-18 %,Email,Manual,20,0.55,0.0,0.0,0.0,0.0,14.0,11.0,11.0,8.0,0,0,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,YwRXGJ,Email 4,Email,Manual,62,0.77419,0.04839,0.0,0.0,0.0,72.0,48.0,50.0,32.0,4,3,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,WmiNBN,[Email #1],Email,Manual,37,0.59459,0.05405,0.0,0.0,0.0,42.0,22.0,21.0,13.0,2,2,0,0.0,0,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,UySV7j,AIMERCE RIQ  |  Abandoned Cart,Y57rLT,[Email #1]-No Sms,Email,Manual,118,0.60169,0.00847,0.0,0.0,0.0,113.0,71.0,78.0,53.0,1,1,0,0.0,0,0.0,2,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,RkzbCs,Copy of Email #1: Brand/Generosity,Email,Manual,238,0.51316,0.00877,0.01316,0.04202,0.00439,175.0,117.0,119.0,78.0,3,2,3,1.0,3,10.0,3,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,Vpbuzf,Copy of Email #1: Brand/Generosity,Email,Manual,117,0.7094,0.01709,0.0,0.0,0.0,144.0,83.0,91.0,54.0,3,2,0,0.0,0,0.0,4,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,WHQQ9T,Email #2,Email,Manual,131,0.488,0.016,0.008,0.0458,0.0,102.0,61.0,65.0,42.0,4,2,1,0.0,1,6.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,SkHvPw,Email #2,Email,Manual,96,0.65625,0.02083,0.0,0.0,0.0,118.0,63.0,68.0,42.0,2,2,0,0.0,0,0.0,3,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,UQMGi2,Email #3,Email,Manual,115,0.55455,0.0,0.00909,0.04348,0.0,101.0,61.0,74.0,45.0,0,0,1,0.0,1,5.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,ViyedR,Email #3,Email,Manual,86,0.61628,0.01163,0.0,0.0,0.0,92.0,53.0,63.0,37.0,1,1,0,0.0,0,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,RNjHyh,Email #4,Email,Manual,105,0.6,0.0,0.0,0.04762,0.0,106.0,60.0,69.0,43.0,0,0,0,0.0,0,5.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,XkRSLw,AIMERCE RIQ | Abandoned Checkout,R6FqAg,Email #8,Email,Manual,78,0.65385,0.01282,0.0,0.0,0.0,101.0,51.0,61.0,32.0,2,1,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,UXLWsi,KL Q3 2025 | Delivered/Post Purchase Flow - Party Speckle & Jubilee,Syk2jc,Email 1 – Party post purchase,Email,Live,232,0.67826,0.01304,0.02174,0.00862,0.0,243.0,156.0,136.0,99.0,3,3,5,0.0,5,2.0,2,Email,live
Apr 16 2025 - Oct 16 2025,UXLWsi,KL Q3 2025 | Delivered/Post Purchase Flow - Party Speckle & Jubilee,TD7ARE,Email 2 – Party post purchase,Email,Live,184,0.57692,0.01099,0.03297,0.01087,0.0,153.0,105.0,88.0,71.0,2,2,7,0.0,6,2.0,4,Email,live
Apr 16 2025 - Oct 16 2025,Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,SzZ8wL,Email 2 Churn $10 off,Email,Live,148,0.34694,0.01361,0.0068,0.00676,0.0,89.0,51.0,64.0,42.0,2,2,1,0.0,1,1.0,0,,live
Apr 16 2025 - Oct 16 2025,Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,U8xeZ5,Email 2 Churn $10 off,Email,Live,555,0.60688,0.00543,0.00181,0.00541,0.0,465.0,335.0,347.0,261.0,5,3,1,0.0,1,3.0,1,,live
Apr 16 2025 - Oct 16 2025,Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,XaZdJN,Offer email buyer retention - customers,Email,Live,558,0.58,0.01636,0.00182,0.01434,0.0,502.0,319.0,347.0,245.0,10,9,1,0.0,1,8.0,0,,live
Apr 16 2025 - Oct 16 2025,Ut4gnD,NEW [RFM] Churn prevention - Advanced KDP - RFM,Y3U3pB,SMS | Offer email buyer retention - customers,Email,Live,149,0.35135,0.00676,0.0,0.00671,0.0,96.0,52.0,70.0,41.0,1,1,0,0.0,0,1.0,0,,live
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,R2Tr6b,Abandoned Cart [Email #1],Email,Manual,1021,0.62598,0.04823,0.00492,0.0049,0.0,1189.0,636.0,775.0,458.0,67,49,5,0.0,5,5.0,25,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Th5Qwv,Abandoned Cart [Email #2],Email,Manual,864,0.60465,0.03488,0.01047,0.00463,0.0,949.0,520.0,655.0,393.0,39,30,9,0.0,9,4.0,9,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,YqjQbD,Abandoned Cart [Email #3] Welcome Discount Reminder,Email,Manual,363,0.60111,0.08033,0.00554,0.00551,0.0,441.0,217.0,295.0,154.0,41,29,2,0.0,2,2.0,7,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,UYFyLQ,Abandoned Cart [Email #4],Email,Manual,347,0.58671,0.0289,0.00289,0.00288,0.0,341.0,203.0,241.0,152.0,16,10,1,0.0,1,1.0,3,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,RFU65b,Copy of Abandoned Cart [Email #3] 10% Discount,Email,Manual,404,0.61881,0.08663,0.00495,0.0,0.0,471.0,250.0,325.0,190.0,42,35,2,0.0,2,0.0,11,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RDUtGN,Q1 2025 QO | Abandoned Cart Reminder,Rf64ka,Copy of Abandoned Cart [Email #3] NO Discount | Free Shipping Over $75 Reminder,Email,Manual,25,0.64,0.08,0.0,0.0,0.0,34.0,16.0,18.0,10.0,2,2,0,0.0,0,0.0,0,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,UXVBcX,Q1 2025 | Back In Stock Flow,THTvXH,Back in Stock: Email #1,Email,Live,1084,0.61967,0.28015,0.00371,0.00554,0.0,1630.0,668.0,869.0,480.0,537,302,4,0.0,4,6.0,90,Q1 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SLYp8Z,Q2 2025 | Browse Abandonment,WhcTNz,Browse Abandonment: email 2,Email,Live,9105,0.53236,0.03358,0.00969,0.00231,0.00022,10077.0,4836.0,6343.0,3494.0,405,305,89,2.0,88,21.0,35,Q1 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SLYp8Z,Q2 2025 | Browse Abandonment,UzqgDu,Browse Abandonment: winning variation,Email,Live,9776,0.52221,0.0317,0.00964,0.00276,0.0001,10377.0,5091.0,6694.0,3705.0,440,309,94,1.0,94,27.0,66,Q1 2025 Flows,live
Apr 16 2025 - Oct 16 2025,UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),UBeULZ,Browse Abandonment: email 2,Email,Live,4738,0.62772,0.02092,0.00951,0.00106,0.0,5240.0,2971.0,3303.0,2077.0,144,99,46,0.0,45,5.0,25,Q1 2025 Flows,live
Apr 16 2025 - Oct 16 2025,UyCEA8,Q2 2025 | Browse Abandonment (Aimerce),Wm4y6B,Q2 2025 | Browse Abandonment (Aimerce) - Email #1.1,Email,Live,5234,0.62548,0.022,0.01205,0.00115,0.0,5625.0,3270.0,3683.0,2325.0,168,115,63,0.0,63,6.0,26,Q1 2025 Flows,live
Apr 16 2025 - Oct 16 2025,QNBTmC,Q2 2025 | PDP Customer Review,TwskFN,PDP Review #2 negative with code,Email,Live,37,0.78378,0.0,0.02703,0.0,0.0,128.0,29.0,33.0,20.0,0,0,2,0.0,1,0.0,0,,live
Apr 16 2025 - Oct 16 2025,QNBTmC,Q2 2025 | PDP Customer Review,VNhLfJ,Review email with code,Email,Live,212,0.73113,0.18396,0.0,0.0,0.0,488.0,155.0,246.0,112.0,58,39,0,0.0,0,0.0,6,,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,Tc43nF,Copy of Post-Purchase Email #3B,Email,Live,302,0.59532,0.04348,0.02007,0.00993,0.0,319.0,178.0,206.0,131.0,27,13,8,0.0,6,3.0,4,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,WAM3WF,Post-Purchase Email #1A,Email,Live,6333,0.68762,0.01077,0.05003,0.00268,0.00032,7611.0,4343.0,4425.0,2932.0,106,68,324,2.0,316,17.0,22,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,U6GRub,Post-Purchase Email #1B,Email,Live,3214,0.66667,0.04085,0.01902,0.00218,0.0,4084.0,2138.0,2412.0,1463.0,165,131,62,0.0,61,7.0,45,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,WrwxfT,Post-Purchase Email #2B,Email,Live,252,0.66,0.028,0.048,0.00794,0.0,313.0,165.0,189.0,115.0,10,7,12,0.0,12,2.0,2,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,XtQ7jQ,Post-Purchase Email #2B,Email,Live,3167,0.60951,0.02029,0.01521,0.00379,0.0,3472.0,1923.0,2249.0,1391.0,79,64,48,0.0,48,12.0,10,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,SZVgVH,Q2 2025 | Post Purchase Flow V2,WXUjx8,Post-Purchase Email #3B,Email,Live,2862,0.59559,0.02801,0.01541,0.0021,0.0,3029.0,1701.0,2009.0,1236.0,119,80,44,0.0,44,6.0,8,Q2 2025 Flows,live
Apr 16 2025 - Oct 16 2025,RxPmK8,Q4 2024 QO | Abandoned Checkout,XB4sbV,Abandoned Checkout - Email #3: Discount,Email,Manual,1525,0.18581,0.01284,0.00676,0.02951,0.00135,404.0,275.0,243.0,164.0,26,19,11,2.0,10,45.0,5,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RxPmK8,Q4 2024 QO | Abandoned Checkout,Y777cM,Email #1: Brand/Generosity,Email,Manual,5174,0.27476,0.01451,0.01356,0.38732,0.00347,1457.0,871.0,870.0,599.0,65,46,46,11.0,43,2004.0,46,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RxPmK8,Q4 2024 QO | Abandoned Checkout,VTwVXk,Email #2: Reviews/social proof,Email,Manual,3334,0.32526,0.00727,0.01423,0.0096,0.00333,1733.0,1074.0,1095.0,726.0,38,24,47,11.0,47,32.0,19,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,RxPmK8,Q4 2024 QO | Abandoned Checkout,U8JVxR,Email #4,Email,Manual,841,0.21883,0.01589,0.00611,0.02735,0.00122,268.0,179.0,188.0,126.0,15,13,5,1.0,5,23.0,2,Q1 2025 Flows,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,RHZetn,Copy of Email #2 - NO SMS,Email,Manual,154,0.54248,0.03922,0.00654,0.00649,0.0,159.0,83.0,85.0,55.0,7,6,1,0.0,1,1.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,W4SiBM,Copy of Email #3-SMS-15%,Email,Manual,157,0.54194,0.02581,0.01935,0.01274,0.0,163.0,84.0,95.0,59.0,5,4,3,0.0,3,2.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,WTbmYF,Email #1 - old customer,Email,Manual,201,0.74129,0.02985,0.00498,0.0,0.0,259.0,149.0,171.0,105.0,8,6,1,0.0,1,0.0,3,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,RfTsp5,Email #2 -Old customer,Email,Manual,191,0.72251,0.04188,0.01571,0.0,0.0,257.0,138.0,162.0,102.0,13,8,3,0.0,3,0.0,2,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,WDYBap,Email #2 -SMS,Email,Manual,53,0.37736,0.07547,0.0,0.0,0.0,53.0,20.0,39.0,15.0,4,4,0,0.0,0,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,XsYavC,Email #3-SMS-18%,Email,Manual,51,0.41176,0.03922,0.0,0.0,0.0,40.0,21.0,26.0,15.0,3,2,0,0.0,0,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,VDgLBk,Email #3-old customer,Email,Manual,164,0.70732,0.02439,0.0,0.0,0.0,209.0,116.0,147.0,86.0,4,4,0,0.0,0,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,UuNbWP,Email #4 -sms-15 %,Email,Manual,149,0.5906,0.04698,0.00671,0.0,0.0,168.0,88.0,101.0,64.0,9,7,1,0.0,1,0.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,RTJK82,Email #4 -sms-18 %,Email,Manual,44,0.59091,0.0,0.02273,0.0,0.0,41.0,26.0,31.0,22.0,0,0,1,0.0,1,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,RJnJdb,Email 4,Email,Manual,148,0.74324,0.02703,0.01351,0.0,0.0,234.0,110.0,144.0,81.0,4,4,2,0.0,2,0.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,WAx73g,[Email #1],Email,Manual,92,0.57143,0.03297,0.01099,0.01087,0.0,93.0,52.0,45.0,32.0,5,3,1,0.0,1,1.0,5,RIQ,manual
Apr 16 2025 - Oct 16 2025,TGnnV4,RIQ | Abandoned Cart,Xhe9W2,[Email #1]-No Sms,Email,Manual,237,0.61277,0.04255,0.00851,0.00844,0.0,238.0,144.0,155.0,105.0,15,10,2,0.0,2,2.0,6,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,URXer6,Copy of Email #1: Brand/Generosity,Email,Manual,487,0.47126,0.01839,0.02069,0.10678,0.0,349.0,205.0,211.0,141.0,9,8,9,0.0,9,52.0,6,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,WVWp2j,Copy of Email #1: Brand/Generosity,Email,Manual,240,0.65,0.06667,0.00417,0.0,0.0,259.0,156.0,162.0,104.0,24,16,1,0.0,1,0.0,8,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,UcGbzY,Email #2,Email,Manual,252,0.44355,0.02016,0.02823,0.01587,0.0,187.0,110.0,108.0,72.0,8,5,8,0.0,7,4.0,4,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,SEpj98,Email #2,Email,Manual,199,0.63317,0.0201,0.0,0.0,0.0,226.0,126.0,133.0,84.0,5,4,0,0.0,0,0.0,3,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,RDxeRH,Email #3,Email,Manual,241,0.45992,0.02532,0.02954,0.0166,0.0,197.0,109.0,118.0,77.0,12,6,7,0.0,7,4.0,0,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,Yqdfa9,Email #3,Email,Manual,190,0.63158,0.01053,0.01053,0.0,0.0,199.0,120.0,122.0,78.0,2,2,2,0.0,2,0.0,2,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,VjBLdU,Email #4,Email,Manual,256,0.564,0.032,0.008,0.02344,0.0,256.0,141.0,143.0,90.0,11,8,2,0.0,2,6.0,1,RIQ,manual
Apr 16 2025 - Oct 16 2025,TgTC7w,RIQ | Abandoned Checkout,WqpkLn,Email #8,Email,Manual,183,0.69945,0.06011,0.0,0.0,0.0,231.0,128.0,129.0,85.0,15,11,0,0.0,0,0.0,4,RIQ,manual
Apr 16 2025 - Oct 16 2025,TiXiwE,RIQ | Welcome Series,XLvCYU,Email-1 without SMS,Email,Live,2106,0.63619,0.06699,0.02152,0.02896,0.0,2307.0,1301.0,1252.0,854.0,196,137,44,0.0,44,61.0,160,"Q1 2025 Flows, Welcome Series Main",live
Apr 16 2025 - Oct 16 2025,TiXiwE,RIQ | Welcome Series,TA7iXM,Email-2 Without SMS,Email,Live,1527,0.44474,0.01711,0.02961,0.00458,0.0,1103.0,676.0,667.0,457.0,30,26,45,0.0,45,7.0,19,"Q1 2025 Flows, Welcome Series Main",live
Apr 16 2025 - Oct 16 2025,TiXiwE,RIQ | Welcome Series,RUzbW9,Email-3 Without SMS,Email,Live,1366,0.43953,0.02139,0.02065,0.00732,0.0,950.0,596.0,585.0,402.0,33,29,28,0.0,28,10.0,11,"Q1 2025 Flows, Welcome Series Main",live
Apr 16 2025 - Oct 16 2025,TiXiwE,RIQ | Welcome Series,TsKym2,Email-4 Without SMS,Email,Live,1209,0.45242,0.01002,0.01252,0.0091,0.00083,853.0,542.0,519.0,361.0,20,12,15,1.0,15,11.0,5,"Q1 2025 Flows, Welcome Series Main",live
Apr 16 2025 - Oct 16 2025,TiXiwE,RIQ | Welcome Series,WFnip2,Email-5 Without SMS,Email,Live,1109,0.52459,0.01639,0.01457,0.00992,0.0,930.0,576.0,558.0,398.0,25,18,16,0.0,16,11.0,4,"Q1 2025 Flows, Welcome Series Main",live
Apr 16 2025 - Oct 16 2025,XV5MwH,Site Abandonment Flow (Aimerce),XKPgPV,Site Abandonment Email 1 - Bestsellers,Email,Live,954,0.60657,0.03499,0.00848,0.01153,0.0,1068.0,572.0,639.0,405.0,49,33,8,0.0,8,11.0,10,,live
Apr 16 2025 - Oct 16 2025,XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,RN9mzv,Lapsed: Email #1a,Email,Live,2051,0.50049,0.0303,0.00929,0.00244,0.00049,1644.0,1024.0,1149.0,775.0,76,62,19,1.0,19,5.0,14,,live
Apr 16 2025 - Oct 16 2025,XNs4Hz,Sunset Unengaged Subscribers - Customer vs. Non-Customer,Skx9QJ,Never purchased: Email #1b,Email,Live,2784,0.43657,0.00867,0.00723,0.00611,0.0,1864.0,1208.0,1302.0,913.0,29,24,21,0.0,20,17.0,9,,live
Apr 16 2025 - Oct 16 2025,RmY3Fu,[RFM] Loyal/Champion retention flow,W8eDAi,(Repeat purchaser) Drive repurchase with Give info,Email,Live,1821,0.65421,0.01924,0.00715,0.0011,0.0,1987.0,1190.0,1271.0,853.0,45,35,14,0.0,13,2.0,4,,live
Apr 16 2025 - Oct 16 2025,RmY3Fu,[RFM] Loyal/Champion retention flow,UWPNGs,Copy of (Repeat purchaser) Drive repurchase with Give info,Email,Live,497,0.63984,0.02213,0.00201,0.0,0.0,544.0,318.0,383.0,242.0,14,11,1,0.0,1,0.0,0,,live
Apr 16 2025 - Oct 16 2025,RmY3Fu,[RFM] Loyal/Champion retention flow,WvXF85,Copy of Retention - 10% off + July 2025 Impact note,Email,Live,516,0.69574,0.00969,0.00775,0.0,0.0,631.0,359.0,398.0,259.0,10,5,4,0.0,4,0.0,1,,live
Apr 16 2025 - Oct 16 2025,RmY3Fu,[RFM] Loyal/Champion retention flow,Vs8QHU,Retention - 10% off + July 2025 Impact note,Email,Live,1894,0.69995,0.02219,0.01109,0.00053,0.0,2317.0,1325.0,1437.0,923.0,52,42,21,0.0,21,1.0,6,,live
Apr 16 2025 - Oct 16 2025,Sm3rUq,[RFM] MA - Next Best Product Cross-Sell,UApmgV,Email #1 - cross sell,Email,Live,323,0.65109,0.02492,0.02492,0.00619,0.0,336.0,209.0,198.0,140.0,9,8,8,0.0,8,2.0,2,,live
`,
  },
};

// ============================================================================
// CSV PARSING UTILITIES
// ============================================================================

/**
 * Parse CSV string data into JSON array
 */
function parseCSVString(csvString) {
  if (!csvString || csvString.trim() === "") {
    return [];
  }

  const lines = csvString.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : "";
    });
    data.push(row);
  }

  return data;
}

/**
 * Format data summary for AI context
 */
function formatDataSummary(dataString) {
  const parsedData = parseCSVString(dataString);

  if (!parsedData || parsedData.length === 0) {
    return "No data available";
  }

  const sampleSize = Math.min(3, parsedData.length);
  const sample = parsedData.slice(0, sampleSize);

  return `
Total Records: ${parsedData.length}
Columns: ${Object.keys(parsedData[0]).join(", ")}

Sample Data (first ${sampleSize} records):
${JSON.stringify(sample, null, 2)}

Full Dataset Summary:
This dataset contains ${parsedData.length} records with the following structure.
The AI can query and analyze all records in this dataset.
`;
}

// ============================================================================
// SYSTEM PROMPT GENERATOR WITH CHART INSTRUCTIONS
// ============================================================================

function generateSystemPrompt(brandKey) {
  const brand = BRANDS[brandKey];
  const today = new Date().toISOString().split("T")[0];

  return `Current date: ${today}

## 1. ROLE & BRAND CONTEXT

You are a professional Klaviyo Analytics Assistant for ${brand.name}.

Your role is to analyze campaign data, flow data, forms data, and message data, providing insights with visualizations when appropriate.

${brand.name} sells:
${brand.products.map((p) => `- ${p}`).join("\n")}

Brand tone: ${brand.tone}

---

## 2. DATA AVAILABLE

You have access to the following datasets:

### 2.1 FLOW DATA (Message-level flow performance)
**Columns:**
Date, Flow ID, Flow Name, Message ID, Message Name, Message Channel, Status, Total Recipients, Open Rate, Click Rate, Unsubscribe Rate, Bounce Rate, Spam Complaints Rate, Total Opens, Unique Opens, Total Apple Privacy Opens, Unique Apple Privacy Opens, Total Clicks, Unique Clicks, Total Unsubscribes, Spam Complaints, Unique Unsubscribes, Bounces, Total Placed Order, Tags, Message Status

**Notes:**
This dataset contains message-level data for each email in every flow. You can:
- Analyze individual message performance within flows
- Compare messages within the same flow
- Aggregate data to get overall flow performance
- Identify which specific emails drive the best results

${formatDataSummary(brand.flow_data)}

---

### 2.2 FORMS DATA
**Columns:**
form_id, form_name, form_status, created_at, updated_at, closed_form, viewed_form, viewed_form_uniques, submits, submit_rate

${formatDataSummary(brand.forms_data)}

---

### 2.3 FLOW MESSAGES DATA
**Columns:**
message_id, message_name, created_at, updated_at, subject_line, preview_text

${formatDataSummary(brand.flow_messages_data)}

**Columns:** Date,Flow ID,Flow Name,Message ID,Message Name,Message Channel,Status,Total Recipients,Open Rate,Click Rate,Unsubscribe Rate,Bounce Rate,Spam Complaints Rate,Total Opens,Unique Opens,Total Apple Privacy Opens,Unique Apple Privacy Opens,Total Clicks,Unique Clicks,Total Unsubscribes,Spam Complaints,Unique Unsubscribes,Bounces,Total Placed Order,Tags,Message Status
${formatDataSummary(brand.flow_data)}

---

### 2.4 CAMPAIGN MESSAGES DATA
**Columns:**
campaign_message_id, campaign_id, message_id, message_created_at, message_updated_at, preview_text, subject_line

${formatDataSummary(brand.campaign_messages_data)}

---

### 2.5 CAMPAIGN DATA
**Columns:**
Date, Campaign Message ID, Campaign Message Name, Send Date, Send Time, Total Recipients, Open Rate, Click Rate, Unsubscribe Rate, Bounce Rate, Spam Complaints Rate, Total Opens, Unique Opens, Total Apple Privacy Opens, Unique Apple Privacy Opens, Unique Clicks, Total Clicks, Total Unsubscribes, Unique Unsubscribes, Spam Complaints, Bounces, Total Placed Order, Tags, Subject, Preview Text, List, Excluded List, Day of Week, Campaign Message Channel

${formatDataSummary(brand.campaign_data)}

---

## 3. YOUR CAPABILITIES

1. **Answer Questions**: Provide clear, data-driven answers about campaigns, flows, forms, and messages.
2. **Generate Charts**: Create visualizations for any data type or comparisons between them.
3. **Provide Insights**: Offer actionable recommendations based on the data.
4. **Cross-Reference Data**: Connect related data across different datasets (e.g., flow performance with specific messages).

---

## 4. DATA TYPE DETECTION

**Campaigns** (One-time sends):
- Keywords: campaign, blast, send, newsletter, one-time, promotional email
- Data sources: campaign_data, campaign_messages

**Flows** (Automated sequences):
- Keywords: flow, automation, trigger, sequence, journey, series, automated
- Data sources: flow_data (message-level), flow_messages (metadata)
- Note: flow_data contains individual message performance - you can aggregate by Flow ID to get overall flow metrics
- Active flows are flows with "Status" set to "Live" or "Manual".
- Treat each "Flow ID" as a single flow when counting or summarizing. If any message within a flow has "Status" equal to "Live" or "Manual", report that flow as live. Always return numeric totals for flow count questions.

**Forms**:
- Keywords: form, signup, subscription, opt-in
- Data source: forms_data

**Messages**:
- Keywords: message, subject line, preview text, email content
- Data sources: flow_messages, campaign_messages

If the query is ambiguous, ask the user to clarify.

---

## 5. CHART GENERATION RULES

When users ask to visualize data, you MUST:
1. Provide a brief text summary first.
2. Output a JSON code block with chart specifications.
3. Always give valid JSON.

**Chart JSON Format:**

\`\`\`json
{
  "type": "line|bar|pie",
  "title": "Chart Title",
  "data": [
    {"name": "Item 1", "value": 70.8, "clicks": 0.41},
    {"name": "Item 2", "value": 67.5, "clicks": 0.49}
  ],
  "xKey": "name",
  "lines": [{"key": "value", "name": "Metric Name"}],
  "bars": [{"key": "value", "name": "Metric Name"}],
  "valueKey": "value"
}
\`\`\`

**Chart Type Selection:**
- **Bar**: Comparing values across categories (campaigns, flows, time periods).
- **Line**: Trends over time (weekly performance, growth trends).
- **Pie**: Composition / distribution (limit to 6-8 segments).

**Data Formatting:**
- Keep names SHORT (max 20 chars). Truncate campaign/flow names if needed.
- Round percentages to 1 decimal place.
- Remove % symbols from percentage values in data (use 70.8 not "70.8%").
- Include only top 10-15 data points for readability.
- For multiple metrics, use "lines" or "bars" arrays.
- For time-based data, include a date axis when relevant.

---

## 6. EXAMPLE RESPONSES

### CAMPAIGN EXAMPLES

USER: "Plot open rates for top 5 campaigns"
RESPONSE: "Here are the top 5 campaigns by open rate. The Mother's/Father's Day campaign led with 70.8% open rate, followed by Pacific Driftwood at 74.47%.

\`\`\`\`json
{
  "type": "bar",
  "title": "Top 5 Campaigns by Open Rate",
  "data": [
    {"name": "Pacific Driftwd", "open_rate": 74.47},
    {"name": "Mother's Day", "open_rate": 70.8},
    {"name": "Classics Feat", "open_rate": 72.06},
    {"name": "Coastal Tide", "open_rate": 72.0},
    {"name": "Discovery Trvl", "open_rate": 70.3}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"}
  ]
}
\`\`\`"

USER: "Compare open and click rates across campaigns"  
RESPONSE: "Open rate leaders are not always click rate leaders. Pacific Driftwood drives very high opens but moderate click rate, while Summer Sneak drives lower opens but stronger click engagement.

\`\`\`json
{
  "type": "bar",
  "title": "Open Rate vs Click Rate - Top Campaigns",
  "data": [
    {"name": "Pacific Driftwd", "open_rate": 74.47, "click_rate": 0.45},
    {"name": "Mother's Day", "open_rate": 70.8, "click_rate": 0.41},
    {"name": "Summer Sneak", "open_rate": 67.55, "click_rate": 1.18},
    {"name": "Golden Grove", "open_rate": 67.5, "click_rate": 0.49}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"},
    {"key": "click_rate", "name": "Click Rate (%)"}
  ]
}
\`\`\`"

---

### FLOW EXAMPLES

USER: "Show me top performing flows"  
RESPONSE: "Welcome Series is the strongest flow by open rate, followed by Post Purchase. Abandoned Cart and Browse Abandon trail and may need subject line or timing optimization.

\`\`\`json
{
  "type": "bar",
  "title": "Top Flows by Open Rate",
  "data": [
    {"name": "Welcome Series", "open_rate": 65.2},
    {"name": "Post Purchase", "open_rate": 58.3},
    {"name": "Browse Abandon", "open_rate": 52.1},
    {"name": "Abandon Cart", "open_rate": 45.8}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"}
  ]
}
\`\`\`"

USER: "Show performance of each email in the Welcome Series flow"  
RESPONSE: "Email 1 brings the highest engagement, but Email 3 drives the highest click rate and the strongest purchase intent.

\`\`\`json
{
  "type": "bar",
  "title": "Welcome Series - Message Performance",
  "data": [
    {"name": "Email 1: Welc", "open_rate": 72.4, "click_rate": 8.2},
    {"name": "Email 2: Story", "open_rate": 58.1, "click_rate": 6.5},
    {"name": "Email 3: Offer", "open_rate": 51.3, "click_rate": 12.1}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"},
    {"key": "click_rate", "name": "Click Rate (%)"}
  ]
}
\`\`\`"

USER: "Compare first message performance across all flows"  
RESPONSE: "The first touch in Abandoned Cart has the strongest click rate, while Welcome leads in opens. This shows abandoned cart visitors are lower-funnel and ready to act.

\`\`\`json
{
  "type": "bar",
  "title": "First Message Performance by Flow",
  "data": [
    {"name": "Welcome", "open_rate": 72.4, "click_rate": 8.2},
    {"name": "Abandon Cart", "open_rate": 45.2, "click_rate": 15.3},
    {"name": "Post Purch", "open_rate": 61.8, "click_rate": 5.1},
    {"name": "Browse Abn", "open_rate": 38.5, "click_rate": 11.2}
  ],
  "xKey": "name",
  "bars": [
    {"key": "open_rate", "name": "Open Rate (%)"},
    {"key": "click_rate", "name": "Click Rate (%)"}
  ]
}
\`\`\`"

USER: "Show flow revenue trends over time"  
RESPONSE: "Placed orders driven by automated flows are trending upward, with the strongest lift in October.

\`\`\`json
{
  "type": "line",
  "title": "Flow Placed Orders Over Time (through ${today})",
  "data": [
    {"date": "2025-05-15", "placed_orders": 120},
    {"date": "2025-06-30", "placed_orders": 150},
    {"date": "2025-07-31", "placed_orders": 165},
    {"date": "2025-08-31", "placed_orders": 158},
    {"date": "2025-10-16", "placed_orders": 190}
  ],
  "xKey": "date",
  "lines": [
    {"key": "placed_orders", "name": "Placed Orders"}
  ]
}
\`\`\`"

---

### FORMS EXAMPLE

USER: "Show form performance"  
RESPONSE: "Newsletter Signup is your highest converting form, followed by Exit Intent. Homepage Popup underperforms and may need new incentive or creative.

\`\`\`json
{
  "type": "bar",
  "title": "Form Submit Rates",
  "data": [
    {"name": "Newsletter", "submit_rate": 12.5},
    {"name": "Exit Intent", "submit_rate": 8.3},
    {"name": "Homepage Pop", "submit_rate": 6.7}
  ],
  "xKey": "name",
  "bars": [
    {"key": "submit_rate", "name": "Submit Rate (%)"}
  ]
}
\`\`\`"

---

### DELIVERABILITY EXAMPLE

USER: "deliverability"  
RESPONSE: "Deliverability is stable. Bounce rates are controlled and spam complaints remain low, which supports strong inbox placement as of ${today}.

\`\`\`json
{
  "type": "bar",
  "title": "Email Deliverability Metrics (${today})",
  "data": [
    {"name": "Campaigns", "bounce_rate": 0.4, "spam_rate": 0.03},
    {"name": "Flows", "bounce_rate": 0.6, "spam_rate": 0.05}
  ],
  "xKey": "name",
  "bars": [
    {"key": "bounce_rate", "name": "Bounce Rate (%)"},
    {"key": "spam_rate", "name": "Spam Complaint Rate (%)"}
  ]
}
\`\`\`"

This style is required:
- Start directly with the state of deliverability (health, risk, trend).
- Do not explain methodology, data sources, or definitions unless the user explicitly asks.

---

## 7. PERFORMANCE BENCHMARKS

**Campaigns:**
- Open Rate: Good > 40%, Excellent > 60%
- Click Rate: Good > 2%, Excellent > 5%
- Placed Order Rate: Good > 0.2%, Excellent > 0.5%
- Unsubscribe Rate: Concerning > 0.5%

**Flows:**
- Welcome Series Open Rate: Good > 50%, Excellent > 65%
- Abandoned Cart Placed Order Rate: Good > 5%, Excellent > 10%
- Post-Purchase Open Rate: Good > 45%, Excellent > 60%
- Browse Abandonment Click Rate: Good > 8%, Excellent > 15%

**Forms:**
- Submit Rate: Good > 5%, Excellent > 10%
- View to Submit: Good > 3%, Excellent > 8%

---

## 8. RESPONSE GUIDELINES

-Use clear section headers where relevant.
- Avoid extra lines spaces , and use only one line space between paragraphs.
- Do not reveal or describe your reasoning or the approach used to answer the question—only present the final output and provide a direct explanation.
-Never use the words "data", "dataset", or "datasets" in your responses.
- Keep responses concise and actionable.
- Always reference specific campaign/flow/form names and key metrics.
- When asked to visualize, ALWAYS include the JSON chart specification.
- No excessive markdown formatting in regular text.
- If any source is empty or unavailable, inform the user politely.
- When comparing results, provide context about what the differences mean.
- Cross-reference related performance when helpful (e.g., flow messages with flow results).
- When the user asks for quantities (e.g., how many campaigns/flows/forms/messages), respond with explicit numeric counts.
-Do all the calculations and analysis yourself and do not rely on the user to do it for you or ask the user for approach.
-Do not start the output like this "To provide you with the weekly open rates of flows for the last 6 weeks, I'll aggregate the message-level data from the flow dataset. Let's take a look at the trends:" or anything like this "To provide you with the weekly open rates for the last 6 weeks, I'll aggregate the data from the datasets available. Let's take a look:
" that should what is hapening in the background process of aggregation, just start with the output and provide a direct explanation.
Do not reveal or describe your reasoning or the approach used to answer the question—only present the final output and provide a direct explanation.

---

## 9. IMPORTANT CHART RULES

- ALWAYS generate charts when users say: plot, chart, show, visualize, compare, graph, display, trend, trends.
- If the user prompt is about time series data, always include a graph with dates on the x-axis if needed.
- Automatically detect if the query is about campaigns, flows, forms, or messages.
- Keep names short in chart data (max 20 chars).
- Limit to top 10-15 data points for readability.
- Choose appropriate chart types based on the data structure:
  - Bar for comparisons across items.
  - Line for trends over time.
  - Pie for share / distribution.
- Include brief text analysis before the chart JSON.
- For time-based data, include relevant date ranges and include today's date (${today}) in the chart title when appropriate.
- When plotting over time, include dates in the data wherever possible.
- The descriptive text before the chart must summarize the trend and key takeaways, not the data preparation steps.

---

## 10. FIRST MESSAGE

Greet the user warmly and introduce yourself as the ${brand.name} analytics assistant. Let them know you can answer questions and create visualizations for their campaigns, flows (with message-level insights), forms, and messages data. Tell them that you will answer directly with insights, and when they ask for visuals you will include a chart plus a brief interpretation of what the trend means.`;
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

// Update brand data (for uploading CSV content)
app.post("/api/brands/:brandKey/data", (req, res) => {
  try {
    const { brandKey } = req.params;
    const {
      forms_data,
      flow_messages_data,
      campaign_messages_data,
      campaign_data,
      flow_data,
    } = req.body;

    if (!BRANDS[brandKey]) {
      return res.status(404).json({
        error: "Brand not found",
        availableBrands: Object.keys(BRANDS),
      });
    }

    // Update brand data
    if (forms_data !== undefined) BRANDS[brandKey].forms_data = forms_data;
    if (flow_messages_data !== undefined)
      BRANDS[brandKey].flow_messages_data = flow_messages_data;
    if (campaign_messages_data !== undefined)
      BRANDS[brandKey].campaign_messages_data = campaign_messages_data;
    if (campaign_data !== undefined)
      BRANDS[brandKey].campaign_data = campaign_data;
    if (flow_data !== undefined) BRANDS[brandKey].flow_data = flow_data;

    res.json({
      message: "Brand data updated successfully",
      brandName: BRANDS[brandKey].name,
      datasetsUpdated: Object.keys(req.body),
    });
  } catch (error) {
    console.error("Update brand data error:", error);
    res.status(500).json({
      error: "Failed to update brand data",
    });
  }
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