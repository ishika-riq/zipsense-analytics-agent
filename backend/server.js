const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require('path');
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
    name: "Fat and Weird Cookies",
    description: "A health-focused beverage brand",
    products: [
      "Organic electrolyte sports drinks (low-cal, no added sugar)",
      "Pre-workout energy drinks (clean caffeine + nootropics)",
      "Functional wellness sodas",
      "Electrolyte powder mixes",
    ],
    tone: "clean, energetic, and friendly—but professional",
    location: "United States",
    data: `
Campaign Name	Subject	List	Send Weekday	Total Recipients	Unique Placed Order	Placed Order Rate	Revenue	Unique Opens	Open Rate	Total Opens	Unique Clicks	Click Rate	Total Clicks	Unsubscribes	Spam Complaints	Spam Complaints Rate	Successful Deliveries	Bounces	Bounce Rate	Send Date	Send Hour
Summer Flavor Highlight	Sip into Paradise with NOOMA's Coconut Lime! 🌴🥥	180 days engaged, 30 Day NEW, 30 Day Past Purchasers, Active Subscribers - product subscription, Interest - Wellness Soda, Ordered - Wellness soda	Wednesday	11938.0	28.0	0.0024	1432.82	5992.0	0.5034000000000000	8598.0	73.0	0.0061000000000000000	96.0	31.0	1.0	0.0001	11903.0	35.0	0.0029	2024-07-03	14
World Chocolate Day	🍫🌿Celebrate World Chocolate Day with NOOMA's Minty Marvel!	1 Purchase Only: Energy Drink, 1 Purchase Only: Sports Drinks, 180 days engaged, 30 Day NEW, 30 Day Past Purchasers, Active Subscribers - product subscription, All Sport Energy Purchasers, All Sports Drinks Purchasers, Interest - Hydrating Sports Drinks, Interest - Performance Energy drinks, Interest - Wellness Soda, Ordered - Hydrating Sports Drinks, Ordered - Performance energy drinks, Ordered - Wellness soda	Sunday	12768.0	37.0	0.0029	1968.6	5946.0	0.4672	8308.0	58.0	0.0046	72.0	34.0	0.0	0.0	12728.0	40.0	0.0031	2024-07-07	10
Lion's Mane	[MULTIPLE VARIATIONS]	1 Purchase Only: Energy Drink, 180 days engaged, 30 Day NEW, 30 Day Past Purchasers, Active Subscribers - product subscription, Interest - Performance Energy drinks, Ordered - Performance energy drinks	Thursday	12675.0	31.0	0.0025	1966.85	6160.0	0.4902	8608.0	70.0	0.005600000000000000	102.0	37.0	2.0	0.0002	12566.0	109.0	0.0086	2024-07-11	14
`,
  },

  2: {
    name: "MiiR",
    description: "Your second brand description here",
    products: [
      "Product category 1",
      "Product category 2",
      "Product category 3",
    ],
    tone: "professional and innovative",
    location: "United States",
    data: `
Campaign Name,Tags,Subject,List,Send Time,Send Weekday,Total Recipients,Unique Placed Order,Placed Order Rate,Revenue,Unique Opens,Open Rate,Total Opens,Unique Clicks,Click Rate,Total Clicks,Unsubscribes,Spam Complaints,Spam Complaints Rate,Successful Deliveries,Bounces,Bounce Rate,Campaign ID,Campaign Channel
Email Promo | Free shipping April 2025,"Email, promo, shipping",[MULTIPLE VARIATIONS],MiiR - All Subscribers,2025-04-06 11:00:00,Sunday,121401.0,23.0,0.02%,1222.91,58647.0,48.43%,83753.0,770.0,0.64%,929.0,476.0,16.0,0.01%,121108.0,293.0,0.24%,01JQYYRSHTMVBX2ZQ19RWKH2JW,Email
Weekend Agenda | Apr 2025,"Brand, Email, Weekend Agenda",[MULTIPLE VARIATIONS],MiiR - All Subscribers,2025-04-11 10:00:00,Friday,121800.0,23.0,0.02%,998.97,57391.0,47.21%,82390.0,495.0,0.41%,1166.0,435.0,13.0,0.01%,121555.0,245.0,0.20%,01JQYP78WFJFQW9R7WS7J5G31F,Email
"Win back Campaign - Apr 16, 2025",,Deals under $20,Win back _ no visit or puchase 90 days,2025-04-16 12:00:00,Wednesday,240657.0,38.0,0.02%,2011.32,79992.0,33.97%,115373.0,1773.0,0.75%,2769.0,1805.0,315.0,0.13%,235481.0,5176.0,2.15%,01JRX9PKNSNTR5GJMZGPF37PWG,Email
"[Follow-up] Win back Campaign - Apr 16, 2025",,Quench Your Thirst for $20! 💧,"[Engaged non-openers] Win back Campaign - Apr 16, 2025",2025-04-18 12:00:00,Friday,9038.0,3.0,0.03%,123.97,2400.0,26.57%,3254.0,74.0,0.82%,243.0,36.0,1.0,0.01%,9033.0,5.0,0.06%,01JS11YCPNM2ATBTKEVJNCEXY8,Email
Earth day 2025 | Takeback video,,Stainless Steel Recycling,MiiR - All Subscribers,2025-04-22 10:00:00,Tuesday,29719.0,21.0,0.07%,883.23,19983.0,67.31%,31267.0,175.0,0.59%,313.0,128.0,1.0,0.00%,29686.0,33.0,0.11%,01JSFAYY5RTAWFQEF710F1YZHW,Email
Q2 25 Sipper Straw Bottle Launch,new product,[MULTIPLE VARIATIONS],MiiR - All Subscribers,2025-04-24 19:15:00,Thursday,29831.0,23.0,0.08%,894.62,19594.0,65.75%,30245.0,510.0,1.71%,651.0,168.0,2.0,0.01%,29803.0,28.0,0.09%,01JSCQJYBEYNSAZ6SBYJWQC3KN,Email
Q2 2025 | $45 Free Shipping Reminder (clone),"Email, Free Shipping, Smart Send Time, promo, shipping",Final days to unlock free shipping!,Opened or active on site _ 30 days _ no order,2025-04-27 14:00:00,Sunday,1143.0,3.0,0.26%,125.38,808.0,70.69%,1317.0,23.0,2.01%,40.0,27.0,0.0,0.00%,1143.0,0.0,0.00%,01JSQ5QBH2MB6A5GPY3SFRV6KD,Email
May 2025 | Free Etching promo,"promo, promocode",Choose your canvas!,MiiR - All Subscribers,2025-05-02 05:00:00,Friday,30316.0,22.0,0.07%,1156.74,18084.0,59.72%,28193.0,270.0,0.89%,391.0,146.0,1.0,0.00%,30282.0,34.0,0.11%,01JT6JV7G9566FP3BWNBTD0VQA,Email
10 May: Customer Favorites in Focus,"promo, promocode",[MULTIPLE VARIATIONS],MiiR - All Subscribers,2025-05-10 12:00:00,Saturday,32306.0,25.0,0.08%,1362.78,19301.0,59.85%,30634.0,268.0,0.83%,383.0,161.0,5.0,0.02%,32248.0,58.0,0.18%,01JTX5KES0HWF7T25J3EHW0AF0,Email
"16 May: Hydration goals, Summer Ready","promo, promocode",[MULTIPLE VARIATIONS],RIQ 90 days engaged,2025-05-16 12:00:00,Friday,43868.0,18.0,0.04%,923.64,28390.0,65.11%,44635.0,397.0,0.91%,519.0,459.0,17.0,0.04%,43606.0,262.0,0.60%,01JV9ZEXAGPVK2FNR5SQEX6EXK,Email
23 May: Product Spotlight - Chug Lid Email #3,"promo, promocode",We heard you! Let us make it right with the redesigned Leakproof Chug Lid.,chug lid email #3,2025-05-23 12:00:00,Friday,12.0,3.0,25.00%,0.0,10.0,83.33%,20.0,4.0,33.33%,12.0,0.0,0.0,0.00%,12.0,0.0,0.00%,01JVWJ7R4W2MM8V2PNJYFFQKW0,Email
23 May: Product Spotlight - Chug Lid Email#1,"promo, promocode",Meet Your New Favorite Lid,chug lid email#1 segment,2025-05-23 12:00:00,Friday,101160.0,26.0,0.03%,940.48,55922.0,56.61%,81233.0,931.0,0.94%,1270.0,599.0,45.0,0.05%,98780.0,2380.0,2.35%,01JVW2CC9RQBZJHF4EK7QMQ4XB,Email
Win back promo - 1 year lapsed customers,,You deserve better : save 15% this week only.,Lapsed customers _ 1 year _  email,2025-05-25 10:00:00,Sunday,7973.0,4.0,0.05%,183.71,5386.0,67.66%,8685.0,225.0,2.83%,477.0,35.0,0.0,0.00%,7961.0,12.0,0.15%,01JVT97K4P4S2FY1S0ZQGPSFWJ,Email
May 25th: Free engraving PROMO,"promo, promocode","Custom Gear, On Us.",RIQ 90 days engaged,2025-05-25 12:00:00,Sunday,114620.0,43.0,0.04%,2237.65,74987.0,65.62%,109746.0,895.0,0.78%,1212.0,723.0,24.0,0.02%,114270.0,350.0,0.30%,01JW1HKR15RYSEBZCSBEE0H8PY,Email
June 2nd: Tomo + Cold brew filter,"promo, promocode",[MULTIPLE VARIATIONS],RIQ 90 days engaged,2025-06-02 12:00:01,Monday,114794.0,46.0,0.04%,2625.9,76425.0,66.80%,112028.0,721.0,0.63%,868.0,764.0,10.0,0.01%,114406.0,388.0,0.34%,01JWR12F1HS5V8JNB8QMBHYKM7,Email
June 4th: Altitude Blue Launch,"promo, promocode",[MULTIPLE VARIATIONS],"MiiR - All Subscribers, RIQ All Subscribers",2025-06-04 13:00:01,Wednesday,157879.0,45.0,0.03%,2809.06,81549.0,52.72%,119178.0,1285.0,0.83%,1964.0,915.0,33.0,0.02%,154689.0,3190.0,2.02%,01JWX7PYEWRGTTD1TX2M53EZDJ,Email
June 10th: Father’s Day Gifting Guide,"promo, promocode",[MULTIPLE VARIATIONS],120 Days Engaged RIQ,2025-06-10 09:00:00,Tuesday,111391.0,22.0,0.02%,1080.36,67080.0,60.41%,97427.0,670.0,0.60%,999.0,546.0,8.0,0.01%,111041.0,350.0,0.31%,01JX495WCXSVBH781WZBBYGMX6,Email
June 13th: Impact Report 2024,"promo, promocode",[MULTIPLE VARIATIONS],"MiiR - All Subscribers, RIQ All Subscribers",2025-06-13 10:30:00,Friday,161198.0,30.0,0.02%,2213.79,92533.0,58.48%,132529.0,776.0,0.49%,924.0,1002.0,33.0,0.02%,158235.0,2963.0,1.84%,01JXF65NJB3DZ37F4DRXKX419W,Email
June 17th: National Camping Month,"promo, promocode",Celebrate the outdoors!,120 Days Engaged RIQ,2025-06-17 18:00:00,Tuesday,116898.0,13.0,0.01%,723.01,69930.0,59.99%,101612.0,537.0,0.46%,751.0,617.0,22.0,0.02%,116575.0,323.0,0.28%,01JXW8D1QQBJH8ZE71360Y4PJG,Email
June 22nd: Blog Highlight,"promo, promocode","Turkish-style Cold Brew? Yes, Please.",120 Days Engaged RIQ,2025-06-22 10:30:00,Sunday,116465.0,23.0,0.02%,1775.15,73429.0,63.23%,107157.0,826.0,0.71%,1074.0,654.0,10.0,0.01%,116125.0,340.0,0.29%,01JY8RHKDS3FABCWYR777M71SB,Email
June 25th: Hydration Myths Busted,"promo, promocode",Let’s bust some hydration myths.,120 Days Engaged RIQ,2025-06-25 10:30:00,Wednesday,115503.0,15.0,0.01%,974.24,67447.0,58.56%,97916.0,359.0,0.31%,450.0,650.0,8.0,0.01%,115166.0,337.0,0.29%,01JYGVZZKT2MNHYWZYQ8WKFAT6,Email
June 28th: Customer Testimony,"promo, promocode",Why Thousands Choose MiiR,120 Days Engaged RIQ,2025-06-28 10:31:28,Saturday,114465.0,24.0,0.02%,1713.92,69657.0,60.93%,101095.0,402.0,0.35%,525.0,685.0,25.0,0.02%,114325.0,140.0,0.12%,01JYRHATXRX8FW7HA88HGE6MWR,Email
July 2: BOGO Promo – Pourigami + Camp Cup,"promo, promocode",Your New Favorite Brew Duo (With a Gift Inside),"MiiR - All Subscribers, RIQ All Subscribers",2025-07-02 10:30:00,Wednesday,159306.0,49.0,0.03%,2458.43,76342.0,48.78%,110970.0,1069.0,0.68%,2051.0,1447.0,52.0,0.03%,156495.0,2811.0,1.76%,01JZ394GQM1JWQKS5HQRXN2007,Email
June 9:Top Picks for Summer Adventures,"promo, promocode",Adventure-Ready Gear for Every Summer Plan.,"MiiR - All Subscribers, RIQ All Subscribers",2025-07-09 18:00:00,Wednesday,159604.0,39.0,0.03%,2174.39,73035.0,46.22%,106179.0,789.0,0.50%,2032.0,1116.0,41.0,0.03%,158029.0,1575.0,0.99%,01JZQ6JCA9YWFZ2R1KEGB28EQK,Email
June 15: Product Engraving,"promo, promocode",[MULTIPLE VARIATIONS],"180 Days Engaged RIQ, Personalize",2025-07-15 18:00:00,Tuesday,125516.0,33.0,0.03%,2009.43,69039.0,55.06%,101048.0,489.0,0.39%,596.0,812.0,17.0,0.01%,125397.0,119.0,0.10%,01K04K0ET03SQ63F2ZEDV6YTWS,Email
June 18: Carryology,"promo, promocode",MiiR x Carryology Bottles are Here!,"MiiR - All Subscribers, RIQ All Subscribers",2025-07-18 10:30:00,Friday,160023.0,36.0,0.02%,2028.35,72790.0,46.16%,106643.0,1238.0,0.78%,1572.0,1078.0,23.0,0.01%,157694.0,2329.0,1.46%,01K0CJXPT74M081DR6KGTN65WN,Email
July 21: Generosity Driven,"promo, promocode",Products with Purpose.,120 Days Engaged RIQ,2025-07-21 18:00:00,Monday,121357.0,20.0,0.02%,1278.36,69804.0,57.60%,102149.0,259.0,0.21%,362.0,841.0,4.0,0.00%,121189.0,168.0,0.14%,01K0H52KCCDKA6ECRWAZPJJJRP,Email
July 25: Product Spotlight: New Standard Carafe,"promo, promocode",Meet the New Standard in Coffee Gear.,180 Days Engaged RIQ,2025-07-25 18:00:00,Friday,125245.0,23.0,0.02%,1648.95,68991.0,55.16%,101071.0,764.0,0.61%,966.0,866.0,17.0,0.01%,125062.0,183.0,0.15%,01K0XXTJ13R2FMX2AKHE3YTKVR,Email
July 30: MIIR Favorites,"promo, promocode",Your Next Daily Essential: See the Reviews!,120 Days Engaged RIQ,2025-07-30 18:00:00,Wednesday,120603.0,18.0,0.01%,1153.6,68249.0,56.65%,99396.0,586.0,0.49%,725.0,959.0,18.0,0.01%,120471.0,132.0,0.11%,01K1B3WH3PBA7KER037FCVJMS3,Email
Aug 3: Back to school PROMO,"promo, promocode",Free etching on your favorite MiiR!,MiiR - All Subscribers,2025-08-03 18:00:00,Sunday,89525.0,31.0,0.03%,2330.7,47699.0,53.62%,69234.0,487.0,0.55%,635.0,699.0,10.0,0.01%,88955.0,570.0,0.64%,01K1GCAEGYMCFC1R749AF4A9GT,Email
Aug 8: Product Spotlight: 360 Traveler,"promo, promocode",360 Traveler: Sip From Every Side,"180 - days - 360 interest based, 60 Days Engaged RIQ, RIQ RFM Champions, RIQ RFM Loyalists",2025-08-08 18:00:00,Friday,73406.0,20.0,0.03%,1246.66,41012.0,55.92%,60396.0,597.0,0.81%,748.0,682.0,7.0,0.01%,73336.0,70.0,0.10%,01K22QGMPK9YRP4AZQPDHTYG9N,Email
August 14th: LTO Party Collection,"promo, promocode",[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-08-14 18:00:00,Thursday,155467.0,49.0,0.03%,2802.59,84373.0,56.59%,122592.0,1931.0,1.29%,2317.0,1491.0,23.0,0.01%,149088.0,6379.0,4.10%,01K2HCG68SJSQX4WK7CXY4JD7C,Email
August 20th: Brand Ambassador Campaign,"promo, promocode",[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-08-20 19:00:00,Wednesday,148275.0,35.0,0.02%,1965.88,95585.0,65.49%,141563.0,1813.0,1.24%,2221.0,1337.0,27.0,0.02%,145962.0,2313.0,1.56%,01K31CW60Q90VT4E5WMRCS000C,Email
August 24th: Eco-Stylist Silver Status,"promo, promocode",MiiR x Eco Stylist: Raising the Standard.,RIQ All Subscribers,2025-08-24 03:00:00,Sunday,141437.0,30.0,0.02%,1336.11,86185.0,61.64%,123771.0,506.0,0.36%,697.0,1180.0,17.0,0.01%,139810.0,1627.0,1.15%,01K398EE7GTNEQDZ0X8P412RGY,Email
August 26th: International Dog Days,"promo, promocode",[MULTIPLE VARIATIONS],"180 Days Engaged RIQ, Dog Bowl Interest Groups RIQ, Loyals RIQ Definition, RIQ Need Attention Users Not Opened Email, RIQ RFM At Risk, RIQ RFM Champions, RIQ RFM Loyalists, RIQ RFM Recent",2025-08-26 18:00:00,Tuesday,138985.0,19.0,0.01%,601.02,76810.0,55.91%,111734.0,554.0,0.40%,670.0,883.0,20.0,0.01%,137376.0,1609.0,1.16%,01K3GEPXSG0CKRSRT4WP0S09B1,Email
August 29th: Cascara Launch,"promo, promocode",[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-08-29 12:00:00,Friday,138999.0,45.0,0.03%,2282.97,78504.0,57.06%,114493.0,872.0,0.63%,1049.0,808.0,18.0,0.01%,137573.0,1426.0,1.03%,01K3R2BZ6KR79ZRXNV1C4SCG3W,Email
August 31st: Labor Day Sale,"promo, promocode",[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-08-31 10:00:00,Sunday,137357.0,88.0,0.06%,3549.53,82365.0,60.12%,119053.0,795.0,0.58%,1083.0,900.0,9.0,0.01%,137008.0,349.0,0.25%,01K3RHYT81R2V2YYQCHM616BEC,Email
September 3rd: Labor Day Reminder,"promo, promocode","Hey {{ first_name|default:'there' }}, Don’t Miss Free Shipping!",RIQ All Subscribers,2025-09-03 18:00:00,Wednesday,137511.0,137.0,0.10%,4920.49,74354.0,54.93%,109058.0,905.0,0.67%,1116.0,773.0,13.0,0.01%,135371.0,2140.0,1.56%,01K47KYSE91ZBX3GZX7QW0YVJ1,Email
September 10th: Winback Campaign,RIQ,"Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁","365 Days Unengaged Winback 1 RIQ, MiiR_180_Days_Unengaged_Winback 1 RIQ",2025-09-10 10:00:00,Wednesday,3857.0,2.0,0.05%,37.03,246.0,6.40%,304.0,31.0,0.81%,38.0,14.0,2.0,0.05%,3844.0,13.0,0.34%,01K4Q1E74V6WYEVRA1GN0NQ2YR,Email
September 13th: Winback Campaign 2,"promo, promocode","Hey {{ first_name|default:'there' }}, A personal thank you (and a gift inside) 🎁","365 Days Unengaged Winback 2 RIQ, MiiR_180_Days_Unengaged_Winback 2 RIQ",2025-09-13 09:00:00,Saturday,4004.0,1.0,0.03%,39.9,260.0,6.52%,328.0,29.0,0.73%,34.0,7.0,0.0,0.00%,3989.0,15.0,0.38%,01K4QNJZDS1FRPYM55MCHN4NK1,Email
September 17th: Coffee Product Innovation (clone),"promo, promocode",[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-09-17 03:00:00,Wednesday,139283.0,45.0,0.03%,3586.84,82458.0,60.78%,117810.0,1791.0,1.32%,2746.0,581.0,9.0,0.01%,135674.0,3609.0,2.59%,01K5C8QPDW374JST7BTVS3SWR1,Email
September 20th: Hand Grinder,"promo, promocode",Meet the Hand Grinder!,"60 Days Engaged RIQ, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, RIQ RFM Champions, RIQ RFM Loyalists, RIQ RFM Recent + Received Email Last 30 Days, RIQ RFM Recent Opened Email Last 30 Days, RIQ RFM Recents + New Purchasers",2025-09-20 10:00:00,Saturday,135173.0,20.0,0.01%,2027.65,73466.0,54.59%,103884.0,1328.0,0.99%,4078.0,465.0,4.0,0.00%,134567.0,606.0,0.45%,01K5H7REW4W637RWX5447JYQN1,Email
September 23rd: Airlock Coffee Canister Highlight,RIQ,"Keep Your Coffee Fresh, The Smart Way 🥤","120 Days Engaged RIQ, Airlock Coffee Canister Interested RIQ, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, RIQ RFM Champions, RIQ RFM Loyalists, RIQ RFM Recent + Received Email Last 30 Days, RIQ RFM Recent Opened Email Last 30 Days, RIQ RFM Recents + New Purchasers",2025-09-23 10:00:00,Tuesday,134421.0,23.0,0.02%,1188.04,72665.0,54.27%,100016.0,588.0,0.44%,759.0,411.0,7.0,0.01%,133885.0,536.0,0.40%,01K5KVCRFKQZYEJD66JT0CT6K7,Email
September 25th: 360 Lid Highlight,,One Lid. Four Ways to Drink.,"180 Days Engaged RIQ, 360 Lid Interested RIQ, Clicked New Coffee Gear Campaign + Hand Grinder Interested RIQ, RIQ RFM Champions, RIQ RFM Loyalists, RIQ RFM Recent + Received Email Last 30 Days, RIQ RFM Recent Opened Email Last 30 Days, RIQ RFM Recents + New Purchasers",2025-09-25 11:00:00,Thursday,128474.0,57.0,0.04%,4582.19,70319.0,55.21%,97049.0,975.0,0.77%,1175.0,377.0,10.0,0.01%,127375.0,1099.0,0.85%,01K60738QQKCHYJN2PBVA7RZFE,Email
September 29th: Salmon Sisters X Kaladi Brothers,,[MULTIPLE VARIATIONS],RIQ All Subscribers,2025-09-30 18:00:00,Tuesday,136879.0,17.0,0.01%,1128.58,84489.0,62.71%,108985.0,2892.0,2.15%,4303.0,496.0,5.0,0.00%,134731.0,2148.0,1.57%,01K663A96J61ZFVJJTJSWJDCBB,Email
October 1st: Holiday 2025 October Promotion,,"{{ person.first_name|title|default:'MiiR Crew' }}, your holiday 🎁 gift is waiting",RIQ All Subscribers,2025-10-01 11:00:00,Wednesday,134556.0,17.0,0.01%,1977.54,76612.0,57.25%,96746.0,816.0,0.61%,955.0,366.0,7.0,0.01%,133831.0,725.0,0.54%,01K6D4GK0MF9185V6TM6W0A9Q1,Email

`,
  },

  3: {
    name: "Grow Fragrance",
    description: "Your third brand description here",
    products: ["Product line A", "Product line B", "Product line C"],
    tone: "casual and approachable",
    location: "Global",
    data: `
Campaign Name,Tags,Subject,List,Send Time,Send Weekday,Total Recipients,Unique Placed Order,Placed Order Rate,Revenue,Unique Opens,Open Rate,Total Opens,Unique Clicks,Click Rate,Total Clicks,Unsubscribes,Spam Complaints,Spam Complaints Rate,Successful Deliveries,Bounces,Bounce Rate,Campaign ID,Campaign Channel
Hibiscus Tea Scent Feature 2025,Spring 2024,You've just found your perfect escape 🌺,"Engaged (3 Months), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers",2025-04-04 07:31:00,Friday,64656.0,95.0,0.15%,5427.0,42174.0,65.36%,55345.0,260.0,0.40%,373.0,138.0,2.0,0.00%,64528.0,128.0,0.20%,01JMWMNXY5M69TNAYW0P6EPQ8Y,Email
Spring Clothes Hack 2025,Fall 2023,[MULTIPLE VARIATIONS],"Engaged (3 Months), Engaged/Click-Through (30 days), Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-04-06 21:00:00,Sunday,64773.0,50.0,0.08%,3483.64,44072.0,68.19%,58214.0,525.0,0.81%,815.0,168.0,4.0,0.01%,64629.0,144.0,0.22%,01JNKZXS0HR57XCWXKSR49ZSYR,Email
Mother's/Father's Day Opt Out 2025,2024,A quick note about these holidays,Engaged (3 Months),2025-04-09 09:38:00,Wednesday,64517.0,48.0,0.07%,2800.27,45587.0,70.80%,60684.0,264.0,0.41%,351.0,170.0,4.0,0.01%,64386.0,131.0,0.20%,01JNKBNFTCMV9QW500TPVHSHXE,Email
Golden Grove Feature,Classics,You're so golden 🌅,"Engaged (1 month), Engaged (3 Months)",2025-04-11 07:47:00,Friday,63421.0,105.0,0.17%,6438.23,42765.0,67.50%,56565.0,310.0,0.49%,460.0,157.0,5.0,0.01%,63360.0,61.0,0.10%,01JRDVNXJDJPKVK4XFB4FR8YPY,Email
[Follow-up] Golden Grove Feature,Classics,Squeeze the day. 🍊,[Engaged non-openers] Golden Grove Feature,2025-04-13 07:47:00,Sunday,12657.0,15.0,0.12%,857.8,5186.0,41.02%,6310.0,65.0,0.51%,84.0,29.0,2.0,0.02%,12642.0,15.0,0.12%,01JRKDXPS87FKFXFZ43BQX9196,Email
Gift Bundles/Mother's Day 2025,"2023, Summer 2023",You’re about to make their day,"Active on Site (90 Days), Engaged (3 Months), High AOV- Engaged, High LTV (100)- Engaged, Repeats, Scent Quiz Tag, Top Customers (=>3 orders, 60 weeks)",2025-04-15 15:17:00,Tuesday,57052.0,37.0,0.07%,2075.07,35904.0,63.10%,46469.0,261.0,0.46%,395.0,133.0,2.0,0.00%,56900.0,152.0,0.27%,01JQ4NYMTFVKN84AH2XNACB3A7,Email
Summer Sneak Peek,Summer 2025,A new summer scent is almost here 🌊,"Active on Site (90 Days), Engaged (1 month), Engaged (3 Months), Engaged/Click-Through (30 days), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-04-17 15:17:00,Thursday,65258.0,70.0,0.11%,4240.83,43978.0,67.55%,57944.0,771.0,1.18%,1082.0,131.0,6.0,0.01%,65107.0,151.0,0.23%,01JRE1G5Q5AWYNDRQ86A5BE5P3,Email
[Follow-up] Summer Sneak Peek,Summer 2025,"Get first dibs on something special—
our new, limited-edition summer scent is launching soon, and you won’t want to miss it. 

Can’t Wait for Summer? Neither Can We ☀️",[Engaged non-openers] Summer Sneak Peek,2025-04-19 15:17:00,Saturday,11673.0,8.0,0.07%,620.39,4610.0,39.54%,5884.0,90.0,0.77%,111.0,28.0,1.0,0.01%,11660.0,13.0,0.11%,01JS3SF7JKC3HQ7AFRSZ7VFQ2W,Email
Earth Inspired Scents Email 2025,Spring 2024,[MULTIPLE VARIATIONS],"1st Time Customers, Active on Site (30 Days), Engaged (1 month), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Repeats, Top Customers (=>3 orders, 60 weeks)",2025-04-21 21:00:00,Monday,62397.0,83.0,0.13%,5783.14,41617.0,66.86%,54869.0,198.0,0.32%,462.0,129.0,4.0,0.01%,62243.0,154.0,0.25%,01JNM11VEBF4DBKKKNW4WPG69V,Email
Cabana Pre-Release 2025,Summer 2025,It's almost here...,"Cabana Customer Waitlist, Summer Waitlist Test 2025",2025-04-22 16:18:00,Tuesday,662.0,9.0,1.37%,623.15,440.0,66.77%,625.0,16.0,2.43%,25.0,2.0,0.0,0.00%,659.0,3.0,0.45%,01JS4BG4X6HZZJK52CH5PQ054W,Email
Cabana Early Summer Release 2025,Summer 2025,Your Exclusive Access is Here 🌴,"Cabana Customer Waitlist, Summer Waitlist Test 2025",2025-04-24 04:33:00,Thursday,936.0,118.0,12.66%,7792.3,613.0,65.77%,929.0,282.0,30.26%,413.0,1.0,0.0,0.00%,932.0,4.0,0.43%,01JRJY5KADG2HFJBNNMBP2A2CP,Email
Summer Launch 2025,Summer 2024,NEW: The Summer Collection is here! 🌴,"1st Time Customers, Engaged (3 Months), Full List, High AOV- Engaged, Newsletter, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-04-25 04:18:00,Friday,86077.0,252.0,0.29%,17998.25,44550.0,52.02%,58861.0,1145.0,1.34%,1772.0,200.0,11.0,0.01%,85641.0,436.0,0.51%,01JRJXM1YW61NW2AYXZAXSQ0C5,Email
Cabana Early Summer Release Reminder 2025,Summer 2025,We’ve Saved Your Spot,"Cabana Customer Waitlist, Summer Waitlist Test 2025",2025-04-26 04:48:00,Saturday,922.0,29.0,3.16%,1784.88,518.0,56.49%,729.0,74.0,8.07%,103.0,1.0,0.0,0.00%,917.0,5.0,0.54%,01JRJY024DHDKDX3C570SE2XXQ,Email
Summer Launch Reminder 2025,"2023, Summer 2023",Don't miss out on these limited scents 🌴,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, High LTV (100)- Engaged, Newsletter, Potential Purchasers, Scent Quiz Tag, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-04-26 05:19:00,Saturday,68840.0,138.0,0.20%,9095.62,41751.0,60.84%,54803.0,362.0,0.53%,532.0,151.0,5.0,0.01%,68627.0,213.0,0.31%,01JRJXWZN89TV5GJ8QVSS9RWXW,Email
Cabana Scent Feature 2025,Summer 2024,NEW SCENT: Cabana 🌴,"Active on Site (30 Days), Engaged (3 Months), Fans, High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Superfans, Top Customers (=>3 orders, 60 weeks)",2025-04-29 06:54:00,Tuesday,65968.0,146.0,0.22%,9263.25,43101.0,65.48%,56757.0,539.0,0.82%,694.0,140.0,6.0,0.01%,65825.0,143.0,0.22%,01JRJZ6RXXFGSQZP8XH0Y8N0VS,Email
Mother's Day Gift Guide 2025,Summer 2024,Gifts That Surprise + Delight 🌊,"Active on Site (30 Days), Engaged (3 Months), Engaged/Click-Through (30 days), Potential Purchasers, Repeats, Top Customers (=>3 orders, 60 weeks)",2025-05-01 07:51:00,Thursday,35604.0,120.0,0.34%,7167.02,17913.0,50.42%,23586.0,248.0,0.70%,349.0,101.0,3.0,0.01%,35530.0,74.0,0.21%,01JNRR22RBXTBCXH7Q4NN4BNZ5,Email
[Follow-up] Cabana Scent Feature 2025,Summer 2024,Smells like your next vacation ⛱️,[Engaged non-openers] Cabana Scent Feature 2025,2025-05-03 06:54:00,Saturday,12373.0,20.0,0.16%,1254.11,4369.0,35.34%,5127.0,71.0,0.57%,95.0,29.0,0.0,0.00%,12361.0,12.0,0.10%,01JT1S26ZGVW5GJXX12R3RMC92,Email
[Follow-up] Mother's Day Gift Guide 2025,Summer 2024,Seriously Good Summer Sets for Gifting (or Keeping),[Engaged non-openers] Mother's Day Gift Guide 2025,2025-05-04 07:51:00,Sunday,9369.0,15.0,0.16%,1191.42,2318.0,24.75%,2695.0,78.0,0.83%,100.0,24.0,0.0,0.00%,9365.0,4.0,0.04%,01JT7199C7VEZQ6ZFEWZQ0K614,Email
Summer Discovery 2025,Summer 2024,Can’t pick one? Try them all.,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-06 08:12:00,Tuesday,66743.0,114.0,0.17%,6802.91,41240.0,61.92%,53346.0,403.0,0.60%,553.0,150.0,2.0,0.00%,66597.0,146.0,0.22%,01JSYDP7A3ZAZC5MBV3KW2NEW9,Email
Behind the Scent: Cabana 2025,Summer 2024,How we bottled a vacation ☀️,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-08 07:47:00,Thursday,36334.0,92.0,0.25%,5492.17,17679.0,48.78%,23347.0,258.0,0.71%,354.0,94.0,4.0,0.01%,36241.0,93.0,0.26%,01JSYHKD84T18VZEA6E8TPVFYY,Email
Last Call Spring Email 2025,Summer 2024,Last Chance for Spring Scents 🌿,"Engaged (3 Months), Potential Purchasers, Spring Seasonal Shoppers",2025-05-10 04:18:00,Saturday,33175.0,141.0,0.43%,9497.51,16889.0,51.03%,22330.0,325.0,0.98%,485.0,64.0,2.0,0.01%,33096.0,79.0,0.24%,01JRZVC7H275WHCSESENM0D7ZY,Email
[Follow-up] Last Call Spring Email 2025,Summer 2024,Low stock alert: Spring scents,[Engaged non-openers] Last Call Spring Email 2025,2025-05-12 04:18:00,Monday,8775.0,13.0,0.15%,800.46,2579.0,29.42%,3031.0,75.0,0.86%,109.0,23.0,0.0,0.00%,8766.0,9.0,0.10%,01JTXTV9E6KJTQA4HVBMYCRB29,Email
Last Call Spring Email 2025 (Spring Seasonal Purchasers),Summer 2024,Last Chance for Spring Scents 🌿,Spring Seasonal Purchasers,2025-05-13 04:08:00,Tuesday,6175.0,17.0,0.28%,1148.35,2890.0,47.08%,3696.0,37.0,0.60%,54.0,21.0,2.0,0.03%,6138.0,37.0,0.60%,01JV2GS7ZPY19P4A97GMJE2YA3,Email
Coconut Pineapple Scent Feature 2025 (Engaged),Summer 2024,The must-have scent of the season 🥥,"Active on Site (30 Days), Fans, High AOV- Engaged, High LTV (100)- Engaged, Highly Engaged (1 month, no purchase), Repeats, Summer Seasonal Purchasers, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-14 07:54:00,Wednesday,29715.0,96.0,0.32%,5873.25,19445.0,65.53%,25580.0,193.0,0.65%,244.0,55.0,0.0,0.00%,29672.0,43.0,0.14%,01JRZZC3GXXV7904A0EB8N74YW,Email
Coconut Pineapple Scent Feature 2025 (Less Engaged),Summer 2024,The must-have scent of the season 🥥,"1st Time Customers, Less Engaged (3 Months), Potential Purchasers",2025-05-14 08:33:00,Wednesday,48682.0,26.0,0.06%,1792.87,8397.0,17.61%,10912.0,171.0,0.36%,244.0,436.0,46.0,0.10%,47681.0,1001.0,2.06%,01JV2J661E27C32R1HE1FQDVJC,Email
Coconut Pineapple Scent Feature 2025 (3 months),Summer 2024,The must-have scent of the season 🥥,Do not receive Coconut Pineapple campaign,2025-05-15 15:08:07,Thursday,744.0,4.0,0.54%,187.54,451.0,61.11%,637.0,13.0,1.76%,116.0,4.0,0.0,0.00%,738.0,6.0,0.81%,01JVAN8WS32PVC2Q54E00BVYXY,Email
Cabana Review Ask,Summer 2025,"{{ person.first_name|title|default:'friend' }}, did you love Cabana?",Cabana Purchasers (30 days),2025-05-16 06:54:00,Friday,5.0,0.0,0.00%,0.0,4.0,80.00%,5.0,0.0,0.00%,0.0,0.0,0.0,0.00%,5.0,0.0,0.00%,01JSHH40370Y7R6NQ179R62RYH,Email
Summer Daily Rituals 2025,,This is how we use our sprays every day,"Engaged (1 month), Engaged/Click-Through (30 days), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Sprays Only- Engaged, Summer Seasonal Waitlist, Summer Waitlist Test 2025",2025-05-17 04:33:00,Saturday,34859.0,97.0,0.28%,6334.37,18134.0,52.13%,24133.0,248.0,0.71%,346.0,92.0,3.0,0.01%,34783.0,76.0,0.22%,01JT3XTWQY0JK2HQ89HFFFS2SA,Email
Sea Salt Neroli Archive Sneak Peek 2025,,Coming Soon... 🏖️,"Engaged (1 month), Potential Purchasers, Sea Salt Neroli Purchasers (90 Weeks), Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-20 08:11:00,Tuesday,29697.0,59.0,0.20%,4193.01,18737.0,63.20%,24850.0,155.0,0.52%,213.0,90.0,1.0,0.00%,29646.0,51.0,0.17%,01JT3PF1XVQCVW9TER2YJ70E9F,Email
Sea Salt Neroli Archive Launch 2025,Summer 2025,Sea Salt Neroli is back 🏖️,"Engaged (1 month), High AOV- Engaged, High LTV (100)- Engaged, Sea Salt Neroli Purchasers (90 Weeks), Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-22 04:11:00,Thursday,32331.0,172.0,0.53%,10847.44,19222.0,59.55%,25785.0,482.0,1.49%,654.0,94.0,2.0,0.01%,32278.0,53.0,0.16%,01JT3EK2FYWJ71KPTFJ4NN9816,Email
Sea Salt Neroli Archive Reminder 2025,Summer 2025,Did you hear what’s back?,"Engaged (1 month), Potential Purchasers, Sea Salt Neroli Purchasers (90 Weeks), Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-24 04:13:00,Saturday,29544.0,132.0,0.45%,8353.29,18092.0,61.34%,24416.0,246.0,0.83%,341.0,88.0,2.0,0.01%,29495.0,49.0,0.17%,01JT3HMS3AZTYY4BKR1C7BEXBN,Email
Behind the Scent: Sea Salt Neroli 2025,Summer 2024,How We Captured the Coast in Full Bloom 🌺🌊,"Engaged (3 Months), High AOV- Engaged, Highly Engaged (1 month, no purchase), Potential Purchasers, Sea Salt Neroli Purchasers (90 Weeks), Summer Seasonal Purchasers, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-05-28 07:48:00,Wednesday,42460.0,81.0,0.19%,5133.77,18320.0,43.27%,24822.0,244.0,0.58%,362.0,137.0,5.0,0.01%,42336.0,124.0,0.29%,01JV3046ETDGEJZEM9NS3TA853,Email
Summer 3 Wick Candles 2025,,For when the day finally slows down,"Candle Purchasers, Engaged (1 month), High AOV- Engaged, High LTV (100)- Engaged, Summer Seasonal Waitlist",2025-05-30 07:46:00,Friday,19192.0,39.0,0.20%,2632.78,9852.0,51.44%,13517.0,78.0,0.41%,130.0,37.0,2.0,0.01%,19151.0,41.0,0.21%,01JT3TFG83WTXCATYJBMK0GDDG,Email
"Cabana Back in Stock, May 2025",Summer 2025,Back in Stock: Cabana 🌴,"Engaged (3 Months), Summer Seasonal Waitlist, Summer Waitlist Test 2025",2025-06-01 13:35:01,Sunday,67721.0,102.0,0.15%,5733.33,46944.0,69.49%,62461.0,324.0,0.48%,461.0,288.0,2.0,0.00%,67554.0,167.0,0.25%,01JT42NEWTTZSD31MJHYXA9P50,Email
Coastal Tide Feature 2025,Holidays 2024,The coastal scent you've been waiting for is back! 🌊,"1st Time Customers, Engaged (1 month), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Repeats, Top Customers (=>3 orders, 60 weeks)",2025-06-03 15:17:00,Tuesday,67860.0,123.0,0.18%,7021.52,48759.0,72.00%,65777.0,475.0,0.70%,918.0,293.0,4.0,0.01%,67718.0,142.0,0.21%,01JV7VWH88PGS4TGDE8M357ZA4,Email
Summer Scent Quiz 2025,Fall 2023,[MULTIPLE VARIATIONS],"1st Time Customers, Engaged (3 Months), New Subscribers, Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-06-04 21:00:00,Wednesday,41614.0,76.0,0.18%,4952.53,21979.0,52.96%,30000.0,313.0,0.75%,514.0,218.0,1.0,0.00%,41500.0,114.0,0.27%,01JRZW7VWC5J2BYGRVXEN7FKE8,Email
Summer Car Fresheners 2025,Summer 2024,"For road trips, beach days & everyday","1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-06-07 04:34:00,Saturday,41378.0,70.0,0.17%,4134.95,20818.0,50.44%,27963.0,186.0,0.45%,685.0,187.0,0.0,0.00%,41273.0,105.0,0.25%,01JSYYBCKGDJFD94ZAY5FB2TE0,Email
[Follow-up] Summer Car Fresheners 2025,Summer 2024,Add to car 🚗,[Engaged non-openers] Summer Car Fresheners 2025,2025-06-09 04:34:00,Monday,9819.0,10.0,0.10%,459.16,2719.0,27.70%,3479.0,62.0,0.63%,112.0,49.0,2.0,0.02%,9815.0,4.0,0.04%,01JX5VD5409E4X3VVGC3VZ7SVS,Email
Behind the Scent: Coconut Pineapple 2025,Summer 2024,What’s really inside Coconut Pineapple? 🍍,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-06-10 10:12:00,Tuesday,72815.0,81.0,0.11%,4467.14,47799.0,65.82%,64053.0,285.0,0.39%,437.0,242.0,4.0,0.01%,72618.0,197.0,0.27%,01JSYQMV5ZG2TZTZAE64G9BG5V,Email
Discovery Set Summer Travel Email 2025,Summer 2024,Going somewhere?,"Active on Site (30 Days), Engaged (1 month), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers",2025-06-12 07:33:00,Thursday,65784.0,74.0,0.11%,4229.23,46155.0,70.30%,61108.0,250.0,0.38%,345.0,248.0,3.0,0.01%,65651.0,133.0,0.20%,01JWY7R1WBXD6GNPS1W379648E,Email
Cabana Reviews 2025,"Reviews, Woodland Sage",Our best summer scent yet? 🤔,"Engaged (3 Months), Highly Engaged (1 month, no purchase), New Subscribers, Potential Purchasers, Repeats, Summer Seasonal Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-06-14 04:18:00,Saturday,78269.0,105.0,0.14%,5980.42,47389.0,60.73%,62509.0,321.0,0.41%,569.0,259.0,6.0,0.01%,78036.0,233.0,0.30%,01JV2VQ9E5EDE35ECZK2NKBABA,Email
Subscription Survey (4+ Orders 52 Weeks),Survey,"Help Us Out & Get 15% Off, {{ person.first_name|title|default:'friend' }}!",Subscription Survey Customers,2025-06-17 07:19:00,Tuesday,1293.0,19.0,1.47%,1121.99,786.0,60.84%,1198.0,124.0,9.60%,162.0,5.0,0.0,0.00%,1292.0,1.0,0.08%,01JXWFCDSY19W8TMEMHRVVF4WV,Email
Favorite Summer Poll 2025 Email,Spring 2024,Vote: What's Your Favorite Summer Scent?,"Purchasers (90 days), Summer Seasonal Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-06-18 07:11:00,Wednesday,32118.0,58.0,0.18%,3654.46,16215.0,50.67%,21339.0,213.0,0.67%,279.0,108.0,6.0,0.02%,31999.0,119.0,0.37%,01JV2SQHTZYMEMBK3PZDS583MV,Email
1st day of Summer 2025,Summer 2024,Your Guide to a Relaxing Summer 😌,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Purchasers, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-06-20 07:12:00,Friday,47231.0,67.0,0.14%,4194.18,20709.0,44.00%,27859.0,230.0,0.49%,363.0,182.0,5.0,0.01%,47066.0,165.0,0.35%,01JVD4SS00600GEQT9AWCCD0PV,Email
Summer Reviews 2025,Fall 2023,Customer Favorites: Summer Edition ✨,"1st Time Customers, Engaged (3 Months), Potential Purchasers, Repeats, Top Customers (=>3 orders, 60 weeks)",2025-06-24 15:47:00,Tuesday,72687.0,88.0,0.12%,5415.04,48307.0,66.62%,64517.0,382.0,0.53%,591.0,267.0,3.0,0.00%,72513.0,174.0,0.24%,01JV7M19TQT3DR976K5V6H1FNG,Email
Blondewood Scent Feature (Engaged),Classics,Calling all vanilla lovers ✨,"1st Time Customers, Engaged (1 month), Engaged Top Customers, High AOV- Engaged, High LTV (100)- Engaged, Highly Engaged (1 month, no purchase), Top Customers (=>3 orders, 60 weeks)",2025-06-26 07:38:00,Thursday,66046.0,70.0,0.11%,4383.95,45633.0,69.22%,60563.0,260.0,0.39%,323.0,260.0,4.0,0.01%,65925.0,121.0,0.18%,01JRDWYPMBD2X9P92VXC337Z3Q,Email
Summer Favorite Winner 2025,Summer 2025,This was a close one...😮,"Cabana Customer Waitlist, Engaged (1 month), Summer Collection Purchasers (7 days), Summer Seasonal Purchasers, Summer Seasonal Waitlist, Summer Waitlist Test 2025",2025-06-28 04:33:00,Saturday,72556.0,110.0,0.15%,6334.45,46561.0,64.35%,61776.0,984.0,1.36%,1208.0,321.0,12.0,0.02%,72352.0,204.0,0.28%,01JY27B6JZZN6SFNE1E97XE3SN,Email
[Follow-up] Blondewood Scent Feature (Engaged),Classics,The vanilla that went viral.,[Engaged non-openers] Blondewood Scent Feature (Engaged),2025-06-28 07:38:00,Saturday,189.0,2.0,1.06%,104.68,43.0,22.75%,57.0,1.0,0.53%,1.0,1.0,0.0,0.00%,189.0,0.0,0.00%,01JYQ3A5NBYVWBKC16ZYFKADNQ,Email
Behind the Scent: Coastal Tide 2025,Summer 2024,The story behind our cleanest summer scent,"1st Time Customers, Engaged (3 Months), High AOV- Engaged, Potential Purchasers, Repeats, Summer Seasonal Purchasers, Summer Seasonal Waitlist, Top Customers (=>3 orders, 60 weeks)",2025-07-01 08:45:00,Tuesday,47111.0,59.0,0.13%,3057.5,20112.0,42.84%,26958.0,169.0,0.36%,310.0,267.0,7.0,0.01%,46950.0,161.0,0.34%,01JV80K4WJC03QMS2PFJ3KXZVH,Email
Pacific Driftwood Waitlist Sign Up 2025,Summer 2025,A new scent is on the horizon ⛰️,"Engaged (3 Months), Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-07-03 04:18:00,Thursday,69088.0,48.0,0.07%,3481.18,46799.0,67.90%,62076.0,405.0,0.59%,526.0,338.0,2.0,0.00%,68928.0,160.0,0.23%,01JWXJD5MSJE5S880RWJD85SF3,Email
Classics Feature Summer 2025,Summer 2025,"Always in season, always in carts 🛒","Engaged (1 month), Engaged Top Customers, High AOV- Engaged, High LTV (100)- Engaged",2025-07-05 04:08:00,Saturday,65433.0,74.0,0.11%,5346.28,47059.0,72.06%,61760.0,188.0,0.29%,273.0,330.0,3.0,0.01%,65301.0,132.0,0.20%,01JY26FQFMHB60H6Q2F2MQ8P8G,Email
Pacific Driftwood Sneak Peek,Summer 2025,A sneak peek at our new scent 🌊,"Engaged (1 month), Engaged/Click-Through (30 days), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-07-08 07:47:00,Tuesday,65581.0,73.0,0.11%,4659.04,47645.0,72.81%,63321.0,361.0,0.55%,518.0,359.0,6.0,0.01%,65436.0,145.0,0.22%,01JWXJG50X76M7BAVSAMDCW8K1,Email
Pacific Driftwood Early Release 2025,Summer 2025,Your Exclusive Access is Here 🌊 🪵,Pacific Driftwood Waitlist,2025-07-10 04:18:00,Thursday,1.0,0.0,0.00%,0.0,1.0,100.00%,2.0,1.0,100.00%,1.0,0.0,0.0,0.00%,1.0,0.0,0.00%,01JWXJJMCYPN78G9SVTHJ1QNRA,Email
Pacific Driftwood Early Release 2025 (Re-send),Summer 2025,Your Exclusive Access is Here 🌊 🪵,Pacific Driftwood Waitlist,2025-07-10 10:00:20,Thursday,293.0,22.0,7.56%,1420.14,210.0,72.17%,343.0,71.0,24.40%,99.0,0.0,0.0,0.00%,291.0,2.0,0.68%,01JZTA4V80EG37CHDDYXYP0WHJ,Email
Pacific Driftwood Launch 2025,Launches,NEW: Pacific Driftwood 🌊,"Full List, Newsletter, Potential Purchasers, Top Customers (=>3 orders, 60 weeks)",2025-07-11 04:33:00,Friday,84734.0,170.0,0.20%,10424.58,42357.0,50.26%,56236.0,480.0,0.57%,608.0,407.0,10.0,0.01%,84273.0,461.0,0.54%,01JWRVJ07TDF5YGFEJ05T892E8,Email
Pacific Driftwood Launch Reminder,"Launches, Summer 2024",You've never smelled the coast like this,"Active on Site (30 Days), Engaged (3 Months), Launch Emails Only, Potential Purchasers, SCDP Audience Core, SCDP Audience Loyal",2025-07-15 11:15:00,Tuesday,67723.0,80.0,0.12%,4665.84,46042.0,68.15%,61121.0,318.0,0.47%,429.0,421.0,4.0,0.01%,67563.0,160.0,0.24%,01JWXJ7EKCF9YND84QHQBDBSAM,Email
Behind the Scent: Pacific Driftwood,Woodland Sage,“Wait… what is that?”,"Engaged (1 month), Top Customers (=>3 orders, 60 weeks)",2025-07-17 05:19:00,Thursday,62382.0,91.0,0.15%,6047.93,46345.0,74.46%,61717.0,279.0,0.45%,387.0,403.0,5.0,0.01%,62240.0,142.0,0.23%,01JWXJ9F51M95V5GB3M180SBKZ,Email
[Follow-up] Behind the Scent: Pacific Driftwood,Woodland Sage,How this scent won over our entire team,[Engaged non-openers] Behind the Scent: Pacific Driftwood,2025-07-19 05:19:00,Saturday,11493.0,26.0,0.23%,1353.97,5680.0,49.51%,7021.0,81.0,0.71%,259.0,99.0,0.0,0.00%,11473.0,20.0,0.17%,01K0CXYQ31NNGREVKGXZ0WJ5NZ,Email
Spray it where? Email Campaign,,[MULTIPLE VARIATIONS],"Engaged (1 month), Engaged (3 Months), Potential Purchasers",2025-07-21 21:00:00,Monday,69107.0,115.0,0.17%,6876.23,49106.0,71.21%,65774.0,502.0,0.73%,681.0,552.0,3.0,0.00%,68960.0,147.0,0.21%,01K0Q73KPFCD4RXBH9X8PFEMKF,Email
Pacific Driftwood Review Ask,"2025, Review Ask",Can we ask you something?,Pacific Driftwood Purchasers,2025-07-23 15:45:00,Wednesday,473.0,3.0,0.64%,21.96,322.0,68.22%,475.0,24.0,5.08%,27.0,6.0,0.0,0.00%,472.0,1.0,0.21%,01K0Q0EYNGH5290PDG1FG7H519,Email
Last Call Summer Email 2025,Summer 2024,Low stock alert: Your summer favorites,"Engaged (3 Months), Potential Purchasers, Sea Salt Neroli Purchasers (90 Weeks), Summer Seasonal Purchasers, Summer Seasonal Waitlist",2025-07-26 04:23:00,Saturday,75688.0,141.0,0.19%,8751.72,46946.0,62.23%,62117.0,384.0,0.51%,519.0,568.0,6.0,0.01%,75442.0,246.0,0.33%,01JWXJSP38RWEQJ0FM9MGRRP0A,Email
[Follow-up] Last Call Summer Email 2025,Summer 2024,Last Chance for Summer Faves! ⛱️,[Engaged non-openers] Last Call Summer Email 2025,2025-07-28 16:23:00,Monday,12101.0,20.0,0.17%,1427.61,4771.0,39.46%,6040.0,78.0,0.65%,101.0,178.0,0.0,0.00%,12091.0,10.0,0.08%,01K1403CNPP8DXZ3FHMBG3R2VY,Email
Pacific Driftwood Reviews 2025,Summer 2024,[MULTIPLE VARIATIONS],"Engaged (3 Months), High AOV- Engaged, High LTV (100)- Engaged, Potential Purchasers",2025-07-29 21:00:00,Tuesday,69298.0,114.0,0.17%,6722.89,48842.0,70.63%,65747.0,509.0,0.74%,709.0,601.0,6.0,0.01%,69149.0,149.0,0.21%,01K18R3Z4HTJF3S9Q1B0DHXA4H,Email
RIQ:2nd August,,✨ “As seen in People Magazine…”,"(RIQ) 30 DAY NEW, [RIQ] People who have never purchased",2025-08-02 07:00:00,Saturday,28104.0,16.0,0.06%,839.2,13264.0,47.75%,16947.0,94.0,0.34%,160.0,302.0,8.0,0.03%,27780.0,324.0,1.15%,01K1G4DP4FJWKNS40WZBD52APA,Email
5th August - Car Freshner Teaser (clone),,We’ve been working on something fresh,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, Repeats",2025-08-05 10:00:00,Tuesday,64508.0,58.0,0.09%,3420.87,43212.0,67.12%,55521.0,640.0,0.99%,861.0,591.0,4.0,0.01%,64377.0,131.0,0.20%,01K1XGRKKZCP2E8C3FN9EAETNY,Email
7th August - Car Freshener Launch (Waitlist/Repeats),,NEW: Car Fresheners Got a Glow Up 🚗✨,"Car 2.0 Waitlist, Repeats",2025-08-07 07:00:00,Thursday,4465.0,15.0,0.34%,1014.18,2148.0,48.19%,2839.0,84.0,1.88%,173.0,31.0,0.0,0.00%,4457.0,8.0,0.18%,01K1XJ1G6H29VSGG4SRQEEXZS0,Email
7th August - Car Freshener Launch (full list),,NEW: Car Fresheners Got a Glow Up 🚗✨,"Engaged (3 Months), Full List",2025-08-07 09:28:03,Thursday,89436.0,87.0,0.10%,5453.78,41797.0,46.96%,53318.0,555.0,0.62%,705.0,666.0,12.0,0.01%,89000.0,436.0,0.49%,01K22BF832X2W9CPTN5DZ1J9MS,Email
Car Freshner Follow-Up,,That moment when your car smells too good..,"(RIQ) Car Freshner Non openers, Car 2.0 Waitlist",2025-08-09 05:30:00,Saturday,32643.0,19.0,0.06%,1263.31,5531.0,16.98%,6562.0,152.0,0.47%,220.0,397.0,0.0,0.00%,32578.0,65.0,0.20%,01K1XKH5CQR6ZJPDFQ1WAKMYBW,Email
RIQ:12th August - Fall Collection Teaser,,Fall’s Finest Scents Are Almost Here 🍁,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, Repeats",2025-08-12 14:00:00,Tuesday,64768.0,89.0,0.14%,5725.05,43652.0,67.53%,55699.0,698.0,1.08%,983.0,537.0,13.0,0.02%,64641.0,127.0,0.20%,01K24W0SE6T6FM3FNSWJJ72WV0,Email
RIQ:14th August - Fall Collection Launch ,,It smells like fall in here  🍂,"Fall Collection 2025 Waitlist, Full List",2025-08-14 04:30:00,Thursday,67012.0,311.0,0.47%,21328.01,37894.0,56.74%,48433.0,1087.0,1.63%,1511.0,489.0,5.0,0.01%,66789.0,223.0,0.33%,01K2578R1XBXYAHVPY6MQVFQ9N,Email
RIQ:16th August - Fall Launch Follow-Up,,Have you met our new fall scents yet? 🍁,"(RIQ) 30 DAY NEW, (RIQ) Fall Collection Interest, (RIQ) High Intent, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist, Repeats",2025-08-16 11:00:00,Saturday,24386.0,147.0,0.60%,9852.84,13330.0,54.71%,17364.0,431.0,1.77%,575.0,193.0,4.0,0.02%,24364.0,22.0,0.09%,01K2S8FTP54QNGE9KTVXB9YGV5,Email
RIQ:19th August - Flannel + leaves: new scent feature,,Meet the new scent of fall - just launched! 🍂,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, Active on Site (30 Days), Fall Collection 2025 Waitlist",2025-08-19 11:00:00,Tuesday,62816.0,155.0,0.25%,10754.83,42500.0,67.82%,54217.0,453.0,0.72%,624.0,427.0,10.0,0.02%,62663.0,153.0,0.24%,01K2Z5WXJ3PG1W34SVS85P16EV,Email
RIQ:21st August - Behind the Scent: Flannel,,Behind the Scent: Flannel & Leaves 🍁,"Fall Collection 2025 Waitlist, Full List",2025-08-21 11:45:00,Thursday,64947.0,138.0,0.21%,9481.58,36639.0,56.49%,46520.0,312.0,0.48%,380.0,423.0,4.0,0.01%,64864.0,83.0,0.13%,01K2Z6E6EEMWX4ZAXCSTNB931A,Email
RIQ:23rd August - Refill Email,,Your candle’s ready for a refill 🕯️,"Car 2.0 Waitlist, Pacific Driftwood Waitlist",2025-08-23 11:00:00,Saturday,349.0,1.0,0.29%,236.98,187.0,53.74%,254.0,14.0,4.02%,19.0,2.0,0.0,0.00%,348.0,1.0,0.29%,01K396A6DHST6WWQ3Z6VB0381Q,Email
RIQ:23rd August - Refill Email (Personalized),,Your candle’s ready for a refill 🕯️,(RIQ) Candle Refills Campaign,2025-08-25 14:00:00,Monday,18012.0,33.0,0.18%,2895.0,8525.0,47.40%,10875.0,219.0,1.22%,292.0,100.0,3.0,0.02%,17985.0,27.0,0.15%,01K3GTSFVARNV2NFRY5AZBMT96,Email
RIQ: 26th August - National Dog Day,,"Celebrate National Dog Day with Safe, Cruelty-Free Fragrance 🌿🐾","(RIQ) 30 DAY NEW, (RIQ) 90 Day Engaged",2025-08-26 07:00:00,Tuesday,975.0,0.0,0.00%,0.0,697.0,71.49%,930.0,2.0,0.21%,2.0,6.0,0.0,0.00%,975.0,0.0,0.00%,01K3G8WWWKKEV0X80354XW36M4,Email
RIQ: 26th August - National Dog Day (clone),,"Celebrate National Dog Day with Safe, Cruelty-Free Fragrance 🌿🐾","(RIQ) 30 DAY NEW, (RIQ) 90 Day Engaged",2025-08-26 09:30:00,Tuesday,70724.0,102.0,0.14%,6124.1,43045.0,60.92%,54251.0,340.0,0.48%,462.0,422.0,9.0,0.01%,70655.0,69.0,0.10%,01K3K70AC0E58ECSA8YEKAHAAD,Email
RIQ:28th August - Autumn Heirloom,,Experience the season’s most beloved scent 🍂✨,"(RIQ) 30 DAY NEW, (RIQ) Fall Collection Interest, (RIQ) High Intent, (RIQ) Placed Order Last Fall",2025-08-28 14:00:00,Thursday,26802.0,120.0,0.45%,7857.48,14447.0,54.08%,18816.0,279.0,1.04%,339.0,152.0,2.0,0.01%,26714.0,88.0,0.33%,01K3GXC6C81KZ6FXSBYK3DQP1H,Email
RIQ:1st Sept - Labor Day ,,Wishing You a Calm & Cozy Labor Day 🍃,(RIQ) 90 Day Engaged,2025-09-01 06:00:00,Monday,70238.0,100.0,0.14%,6030.21,42863.0,61.27%,53912.0,382.0,0.55%,464.0,351.0,8.0,0.01%,69959.0,279.0,0.40%,01K3V661JEX92TS9A6CYBRMBZ2,Email
RIQ: 4th Sept,,Spot These 3 Sneaky Toxins in 5 Seconds,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) High Intent, [RIQ] People who have never purchased",2025-09-04 10:30:00,Thursday,45148.0,42.0,0.09%,2607.62,25251.0,56.37%,31916.0,240.0,0.54%,344.0,161.0,10.0,0.02%,44794.0,354.0,0.78%,01K4807QG7GDCY4WMRPFH68FBA,Email
RIQ: 4th Sept (clone),,Spot These 3 Sneaky Toxins in 5 Seconds,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) High Intent, [RIQ] People who have never purchased",2025-09-04 11:30:00,Thursday,74880.0,70.0,0.09%,4875.62,41828.0,56.25%,53085.0,340.0,0.46%,480.0,220.0,13.0,0.02%,74356.0,524.0,0.70%,01K4AJ6VFVQYQB63R4GMGPH704,Email
RIQ:7th Sept - 3 Wick Candle Feature,,One candle. Three flames. Big energy.,"(RIQ) 30 DAY NEW, (RIQ) Bought Twice but not candle, (RIQ) Interest - Candle",2025-09-07 10:00:00,Sunday,32635.0,94.0,0.29%,6732.47,17548.0,53.89%,22344.0,502.0,1.54%,655.0,132.0,2.0,0.01%,32560.0,75.0,0.23%,01K4AQGPFPGAMDS9BY8A0HYT6M,Email
RIQ: 11th September - Easy Hack,,We’re letting you in on our cozy sweater secret 🧣,"(RIQ) 90 Day Engaged, (RIQ) Fall Collection Interest, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist",2025-09-11 15:30:00,Thursday,72940.0,96.0,0.13%,5612.5,44320.0,61.01%,55772.0,472.0,0.65%,623.0,210.0,3.0,0.00%,72643.0,297.0,0.41%,01K4SWZ3Y0AB5FWHJ50FR3AFP3,Email
RIQ:15th September,,🔥Fragrance Showdown: Grow vs Big Box,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) High Intent, [RIQ] People who have never purchased",2025-09-15 14:00:00,Monday,65824.0,69.0,0.11%,4450.16,42025.0,64.30%,52319.0,349.0,0.53%,445.0,179.0,6.0,0.01%,65363.0,461.0,0.70%,01K563D231D5VP2C3NBE5RHH4Y,Email
RIQ: 17th September Join the waitlist.,,🍐 New fall fragrance lands tomorrow,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) Placed Order Last Fall, Active on Site (30 Days), Fall Collection 2025 Waitlist",2025-09-17 13:30:00,Wednesday,61847.0,37.0,0.06%,2227.73,43814.0,71.14%,54498.0,716.0,1.16%,920.0,111.0,2.0,0.00%,61590.0,257.0,0.42%,01K593W7X7JA9ZX6V0C1QTM7QT,Email
RIQ:18th Sept - Pear Cider Launch,,🍐 New Scent: Pear Cider has arrived,"(RIQ) All Active Contacts, (RIQ) Pear Cider 2025 Waitlist",2025-09-18 08:45:00,Thursday,106136.0,156.0,0.15%,10281.07,44501.0,42.24%,55334.0,693.0,0.66%,848.0,295.0,12.0,0.01%,105340.0,796.0,0.75%,01K5977WKH1RYFXX4Z7A2BW3Z0,Email
RIQ:20th Sept - Pear Cider Follow-up,,🍐✨ Fall Into Comfort with Pear Cider,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) Fall Collection Interest, (RIQ) High Intent, (RIQ) Pear Cider 2025 Waitlist, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist",2025-09-20 14:30:00,Saturday,61863.0,75.0,0.12%,5437.28,43521.0,70.67%,53504.0,354.0,0.57%,433.0,128.0,3.0,0.01%,61583.0,280.0,0.45%,01K5K718F7VFK8X76WW763AYBQ,Email
RIQ:22nd Sept - First Day of Fall,,It’s Here: The First Day of Fall 🍂,"(RIQ) 30 Day Engaged, (RIQ) Fall Collection Interest, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist",2025-09-22 15:00:00,Monday,67403.0,85.0,0.13%,5179.02,43225.0,64.36%,52852.0,364.0,0.54%,442.0,155.0,4.0,0.01%,67160.0,243.0,0.36%,01K5RDRX33SHHSFQRCB9R7HFTE,Email
RIQ: 25th September,,Enter the Fragranceverse: Ginger Pumpkin awaits🚪,"(RIQ) 30 DAY NEW, (RIQ) 90 Day Engaged, (RIQ) Fall Collection Interest, (RIQ) High Intent, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist",2025-09-25 09:30:00,Thursday,78504.0,98.0,0.12%,6935.83,42202.0,53.94%,50981.0,406.0,0.52%,486.0,171.0,10.0,0.01%,78239.0,265.0,0.34%,01K5RA4HE0SFWB0SHQBCGC9TZY,Email
RIQ: 27th September - Fall Movies,,"Lights, Camera, Cozy: Your Fall Movie & Candle Guide 🎬✨","(RIQ) 30 DAY NEW, (RIQ) 90 Day Engaged, (RIQ) Bought Twice but not candle, (RIQ) Fall Collection Interest, (RIQ) Placed Order Last Fall, Fall Collection 2025 Waitlist",2025-09-27 06:00:00,Saturday,81641.0,92.0,0.11%,7155.22,42339.0,52.13%,50417.0,313.0,0.39%,456.0,200.0,5.0,0.01%,81213.0,428.0,0.52%,01K62YYJY241S7RSAA2JS3FXXM,Email
RIQ : 30th September,,Plot Twist: Candles and Cars Have Something in Common 🚗🕯️,"(RIQ) 30 DAY NEW, (RIQ) 30 Day Engaged, (RIQ) High Intent, [RIQ] People who have never purchased",2025-09-30 15:30:00,Tuesday,65548.0,56.0,0.09%,3958.27,41925.0,64.19%,49101.0,331.0,0.51%,454.0,135.0,7.0,0.01%,65318.0,230.0,0.35%,01K6D0EZ7ZTY516KX4VMS790V4,Email
RIQ: 2nd October,,Play the Glow Game → Win $100 💳✨,(RIQ) All Active Contacts,2025-10-01 15:30:00,Wednesday,103998.0,39.0,0.04%,2696.23,40871.0,39.53%,47567.0,478.0,0.46%,961.0,183.0,10.0,0.01%,103394.0,604.0,0.58%,01K6FQHK2VZ2TQ4F2FC87PNFJ5,Email
`,
  },
};

// ============================================================================
// SYSTEM PROMPT GENERATOR
// ============================================================================

function generateSystemPrompt(brandKey) {
  const brand = BRANDS[brandKey];

  return `You are a professional Klaviyo Campaign Analytics Assistant for internal marketing teams.

Your role is to support the team at ${brand.name}, ${brand.description}. ${
    brand.name
  } sells:
${brand.products.map((p) => `- ${p}`).join("\n")}

The products are sold across ${brand.location}, and the brand's tone is ${
    brand.tone
  }.

---

DATA INPUT  
You are given campaign performance data in CSV format. It includes the following fields:  
- Campaign Name  
- Send Date  
- Campaign Type (e.g. Newsletter, Product Launch, Sale, Reminder)  
- Open Rate (%)  
- Click Rate (%)  
- Unsubscribe Rate (%)  
- Revenue (if available)  
- And other information

Here is the data:
${brand.data}

WHAT YOU DO

You will:
1. Answer campaign performance questions
2. Provide insights and optimizations
3. Suggest next steps and planning help (email calendars, A/B ideas, campaign ideas)
4. Always support insights with specific data
5. Maintain a professional yet easy-to-read tone

---

BENCHMARKS FOR ANALYSIS
Use the following rules when evaluating campaign performance:
- Open Rate
  - Good: > 40%
  - Excellent: > 60%
- Click Rate
  - Good: > 2%
  - Excellent: > 5%
- Unsubscribe Rate
  - Concerning: > 0.5%

Always factor in Campaign Type before judging performance. Sales campaigns may behave differently from educational newsletters.

---

PROFESSIONAL RESPONSE FORMAT GUIDELINES
- Use clear section headers (like "Performance Summary", "Key Highlights", "Recommendations")
- Avoid markdown syntax like ** or * — respond in clean plain text that renders directly in a chat
- Use emojis only sparingly — where it aids clarity or adds polish (e.g. 📈, 📅, ✅)
- No bullet spam — use concise lists or paragraphs for readability
- Keep tone: Professional. Crisp. Helpful. Never robotic.

---

IF USER ASKS FOR AN EMAIL CALENDAR
Before generating it:
- Always ask clarifying questions such as:
  - "Are there any planned promotions, product launches, or seasonal events for the month?"
  - "Would you like a mix of educational, sales, and product emails?"
  - Check if there are major festival events in the requested month to build campaigns around
- Once clarified, generate a monthly calendar with:
  - 8–10 campaign entries
  - Each entry should include:
    - Campaign Name
    - Planned Date & Time
    - Email Type
    - Subject Line
    - Preview Text
  JSON format calendar using this EXACT structure:

  \`\`\`json
  {
    "campaigns": [
      {
        "campaign_name": "Campaign Name Here",
        "planned_date": "Month DD, YYYY", 
        "planned_time": "HH:MM AM/PM EST",
        "email_type": "Newsletter|Product Launch|Sale|Promotional|Educational|Reminder",
        "subject_line": "Subject with relevant emojis",
        "preview_text": "Preview text that complements the subject..."
      }
    ]
  }
  \`\`\`
---
✉️ **IF USER ASKS TO GENERATE EMAIL CONTENT**
First, confirm what the goal of the email is (e.g. sale, product launch, education).

Then provide output using a structured format like, bold out every structure header and give it section by section:

- **Header:** Eye-catching phrase or hook  
- **Hero Section:** Main image/visual concept + punchy value proposition  
- **Information Section:** Short copy to explain context (product use, offer, etc.)  
- **Product Recommendation Block:** Highlight 1–2 products with description + CTA  
- **Social Proof or Benefit Reinforcer:** Short customer quote or clean bullet section  
- **Footer:** Standard elements (unsubscribe link, brand socials, support)

Make it aligned to ${brand.name}'s tone: ${
    brand.tone
  }. Keep each section concise and focused.

---

IF USER ASKS FOR A MONTHLY REPORT
- Provide a polished, structured report
- Use sections like:
  - "Overall Campaign Performance"
  - "Best Performing Campaigns"
  - "Underperforming Campaigns"
  - "Key Learnings"
  - "Recommendations"
- Reference specific campaign names and metrics
- Provide reasoning behind suggestions (not just metrics)

---

FIRST MESSAGE
When starting a new conversation, greet the user warmly and introduce yourself as the ${
    brand.name
  } campaign analytics assistant. Ask them what they'd like to explore today (e.g., campaign performance, calendar planning, email content ideas).

---

FINAL RULES
- Be concise yet exhaustive
- Flag missing or inconsistent data briefly
- If unsure (e.g. vague request), always ask for clarification first
- Tailor responses with brand tone and product context (for ${brand.name})`;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

// In-memory session storage: { sessionId: { brandKey, chatHistory } }
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
        max_tokens: 1000,
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  console.log(`Multi-brand Klaviyo Analytics Server running on port ${PORT}`);
  console.log(`Available brands: ${Object.keys(BRANDS).join(", ")}`);
});
