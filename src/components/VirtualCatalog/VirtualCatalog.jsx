import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCartSimple,
  ShieldCheck,
  CaretDown,
  ShoppingBagOpen,
  ArrowsClockwise,
  Headset,
  ListChecks,
  TrendUp,
  Cloud,
} from '@phosphor-icons/react';
import styles from './VirtualCatalog.module.css';
import { useFireboxVData } from './hooks/useFireboxVData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';
import SecuritySuiteTable from '../SecuritySuiteTable/SecuritySuiteTable.jsx';
import { SECTION_DEFS, getSpecValue } from '../../data/featureSpecs.shared.js';
import BannerCarousel from './BannerCarousel.jsx';

// Model → product image mapping (local public assets)
const MODEL_IMAGES = {
  'FireboxV Small': '/WatchGuardBOM/fireboxv images/s.jpg',
  'FireboxV Medium': '/WatchGuardBOM/fireboxv images/m.jpg',
  'FireboxV Large': '/WatchGuardBOM/fireboxv images/l.jpg',
  'FireboxV XLarge': '/WatchGuardBOM/fireboxv images/xl.jpg',
};

// Spec slug mapping (model key → featureSpecs key)
const SPEC_SLUGS = {
  'FireboxV Small': 'FireboxV-Small',
  'FireboxV Medium': 'FireboxV-Medium',
  'FireboxV Large': 'FireboxV-Large',
  'FireboxV XLarge': 'FireboxV-XLarge',
};

// SKU → URL mapping (Leader partner portal links)
const SKU_URLS = {
  // FireboxV Small
  'NWG-WGVSM001': 'https://partner.leadersystems.com.au/products.html?+wnHCuILZhY=T069VtUzQlsfmmoSGTZ/Ug==FjtqG/BUWP+8Gkcq9IBKcK5C2Ws=',
  'NWG-WGVSM003': 'https://partner.leadersystems.com.au/products.html?w9l+EXaUOU8=R8tZRBBu+xBqNtVISSELEg==oXYJuSMPpdpjTiuZF0BztfDoE/8=',
  'NWG-WGVSM031': 'https://partner.leadersystems.com.au/products.html?MKyfBzmArwI=r08txJn3q4nthsnfiSTVgQ==rvf1S8u18eHVJsOV3k3qNYj1jeg=',
  'NWG-WGVSM033': 'https://partner.leadersystems.com.au/products.html?yO2cfYsnurs=odvBVje0XFUvZ9jBP+Sogg==V/BBu4p9brlQJG5t2IEynSX8vfI=',
  'NWG-WGVSM641': 'https://partner.leadersystems.com.au/products.html?PR2paTJh87c=1Q9K3B5KELl5N6fRxeI2Jg==xfXpdEqsCjPlYwdGL2CQg4Cf9nk=',
  'NWG-WGVSM643': 'https://partner.leadersystems.com.au/products.html?yZNFsfZUBiQ=wvO4doTdCucg8L3EI+Flhg==vYOLHPBhpK5geuSO/7LabbdCv9M=',
  'NWG-WGVSM331': 'https://partner.leadersystems.com.au/products.html?RXHtbIKYEws=QYHRM49d76MCawDV5uKleg==NqF5p1gTFKk1b9SRQOKQP5OGL0A=',
  'NWG-WGVSM333': 'https://partner.leadersystems.com.au/products.html?cBWUSBU03v8=AbJeMpyfnUHq6h/IpK318A==agO8czW5o97mObQW6JjL2+3q3RY=',
  'NWG-WGVSM351': 'https://partner.leadersystems.com.au/products.html?i58XF+JlxoQ=FEUb48G1jZ+p3ll79s4AYg==MM14ZNbgESTg0TeEGAYlJWPqfds=',
  'NWG-WGVSM353': 'https://partner.leadersystems.com.au/products.html?oDpVg/922BM=K5lT0xPL5aMwvDrV2SrT4w==MufdJuCFBVZ6IYPodHeFk/6lvZw=',
  'NWG-WGVSM201': 'https://partner.leadersystems.com.au/products.html?ujzi6y1kFR0=y/yHtNXyjkZX3hZbX5tdXw==KnFy03vw88EuvRp9ja5MIMJtg2c=',
  'NWG-WGVSM203': 'https://partner.leadersystems.com.au/products.html?zDRW7gOBxF0=eQa8jvCwc8WRbgZnPumMYQ==93mkgAcqp62HrwiVMOmXXUrX4UU=',
  'NWG-WGVSM261': 'https://partner.leadersystems.com.au/products.html?rHIeZHLIX4I=VmcIm8F6yeCY0s8nYhWjNQ==J/ceO7lURD6fRCtejF5RWrQIwsE=',
  'NWG-WGVSM263': 'https://partner.leadersystems.com.au/products.html?YVtPtT5dqZo=m/AzLhcj8CgOBahJHxkUHQ==0n7BGanPsq3oXCy5W9J3jFWbj60=',
  'NWG-WGVSM101': 'https://partner.leadersystems.com.au/products.html?Eio2rhbBmh0=alKa9RkbYVG3PlfTSx6nUA==g9HsM05DvzTMDV3mwaMp3iQ071A=',
  'NWG-WGVSM111': 'https://partner.leadersystems.com.au/products.html?WY8c9s27fHo=I1v9C+9TmlQrviuUuG/3OQ==H7G2ZqgX1riFWJigcd7Jaxgd9Eo=',
  'NWG-WGVSM121': 'https://partner.leadersystems.com.au/products.html?iPamk0Q2FME=6T3ih+G0zrmeUgz7E1qB2w==cl1uoMOzhvOQ7XIpYKdgI2FWkTY=',
  'NWG-WGVSM131': 'https://partner.leadersystems.com.au/products.html?joOB63VjVIY=bC2MOpxdfj3nAx9qrIiNpw==hle7UMeGo+wtRDj5B0/RZgeMizA=',
  'NWG-WGVSM141': 'https://partner.leadersystems.com.au/products.html?1kh7CZw74r4=d1KDFUpRztBq9HoRLrKtPQ==XdvN2xe2nKdR4b4vhp19AHmp3d4=',
  'NWG-WGVSM151': 'https://partner.leadersystems.com.au/products.html?ic+Ar9N4QJc=sXkSqrvQSkNWvmTFh2R+QQ==w6xlR7Sw6thDKGrF+q25YHAyg48=',
  'NWG-WGVSM171': 'https://partner.leadersystems.com.au/products.html?XzQ3vv6gXiw=dHKDD7gPzPwpn8hqIDsvWg==t8d/CgD+IK8PP4DBjM8Ygkeghdw=',
  'NWG-WGVSM173': 'https://partner.leadersystems.com.au/products.html?3G76r6vyBuk=Ea0AxiTSMtRkuEJdcJmLSQ==AKbyfaMRR0nKeGNbd+hZMR8SKSU=',
  'NWG-WGVSM181': 'https://partner.leadersystems.com.au/products.html?W1H4FDe9DoE=nfvwa8J8bQH9uTexi6CK+Q==/Z+SIchc1aoluMN+QLZaIn/Yvf4=',
  'NWG-WGVSM521': 'https://partner.leadersystems.com.au/products.html?rOmVE8GuAgg=QQMZIuJRmEfbr5pXAer1Ww==dHZPsM11ZZoFGGmFPBRKjy0WidU=',
  'NWG-WGVSM523': 'https://partner.leadersystems.com.au/products.html?kI0jDoQP5tI=fKY4KiFVyvO37mfd7HUFpw==ZiDkTkKiSIAAPacXohhSDGcWWX0=',
  'NWG-WGVSM061': 'https://partner.leadersystems.com.au/products.html?QbQloHBlLBY=aL0pD4mdvAL8qH1ucLJFRw==eq8SaboNyEHaTUjP/XqAsLZMEpQ=',
  'NWG-WGVSM063': 'https://partner.leadersystems.com.au/products.html?UHTGUn4kvGI=gL/veVt2QyHwf/p15+B3Tg==RON3wkGAW1BLrM0HFGx6FV1mfXY=',
  'NWG-WGVSM671': 'https://partner.leadersystems.com.au/products.html?n5Upmh/QriQ=TYAcCRSYhyX77+KORF5mQg==QyzztlPk/XgXjkRL7XViKx+5apE=',
  'NWG-WGVSM673': 'https://partner.leadersystems.com.au/products.html?3++lc9STLKE=YXZvzyuwhYHhAsQn1bnubQ==rSMfpEBz9xYH2y+pKd84cSPxlvI=',
  // FireboxV Medium
  'NWG-WGVME001': 'https://partner.leadersystems.com.au/products.html?zDf6O9s/FJI=LAJ6MX827HfYy4ZzKsF3LA==M6OS2nxk9A7PmdMmNBwMrtHzij4=',
  'NWG-WGVME003': 'https://partner.leadersystems.com.au/products.html?bDzkWMP469c=h3MDw7J1MeTVg5dhcOnUFg==zoZYYfFE0DNyO0tByv3hw2zN670=',
  'NWG-WGVME031': 'https://partner.leadersystems.com.au/products.html?xCj1litCNHA=cyIpXzKr/DdV1eRYd+jTeA==gUN+D8wghzTWE9NBVCgXcSOQTxc=',
  'NWG-WGVME033': 'https://partner.leadersystems.com.au/products.html?4gigJWiXzbY=EnM10cqoxw16qJwE143l0Q==gOygSqtY76KQTKVTSygikH5qJ/g=',
  'NWG-WGVME641': 'https://partner.leadersystems.com.au/products.html?bFhrqR9to+0=S6BTgz65Gd/9rCc/aScTLQ==pHSg2HbnqGB6uYa/q7jD21aJtSo=',
  'NWG-WGVME643': 'https://partner.leadersystems.com.au/products.html?z9jGbUE0quw=kW+do81lqdh4nzYKuNmPWQ==fihvuTtHKdRpGFvmDJcXcc0lSao=',
  'NWG-WGVME331': 'https://partner.leadersystems.com.au/products.html?3Nw1b5UfVG4=R2vXpBeac9i+dNFMzmCVYw==AlqJwJn9wW98K2I2AXuHUI07wEc=',
  'NWG-WGVME333': 'https://partner.leadersystems.com.au/products.html?u48Kgrxp2G4=sTmBS/V89De+8pGQR7YWcg==A47P0PbTzaUetFZzaxeJRizMoI0=',
  'NWG-WGVME351': 'https://partner.leadersystems.com.au/products.html?ubcXpja9vg8=JY8mtxwA2DZlDmNC2neabg==5fy9OfVOqtIeM0T/qDzBCRi2Nok=',
  'NWG-WGVME353': 'https://partner.leadersystems.com.au/products.html?TLv3+IwwtlY=ptv+Ih9fbV4jQmYAjiEBHQ==S7NvbAjV1TbULvv47RSjiedjGRc=',
  'NWG-WGVME201': 'https://partner.leadersystems.com.au/products.html?4Dsb5ii+/zg=axWY2hND4qmFVaRnXxRaTg==XdSqzHU1uYjc/i7I7Au0iLq1fYk=',
  'NWG-WGVME203': 'https://partner.leadersystems.com.au/products.html?gewnWv53nlA=QQLf4cpRIpzHze69PwaboQ==11MYF+mtiUh8FQ9RbNtrBczFOf4=',
  'NWG-WGVME261': 'https://partner.leadersystems.com.au/products.html?93Bn2WtO/BY=cJNFfgArSHVmFHPO9ntYtg==LbeX5EBakTMen48dqE8KftIUM+4=',
  'NWG-WGVME263': 'https://partner.leadersystems.com.au/products.html?C7MnhHm7bKA=u3SlX4mkCs7zCDlrUOu8FA==LSe/LdI4ZuZS+nnPdZZeQubyfWA=',
  'NWG-WGVME101': 'https://partner.leadersystems.com.au/products.html?RZt1hHz+7S0=tGZZpVVLC8iaGUO2GUA2pg==1SD4nKMcHKTY0Iipa/GiUCfcRog=',
  'NWG-WGVME111': 'https://partner.leadersystems.com.au/products.html?sHoPogCsOG0=kUrg7atLtqF16GrpdjsQQQ==Qm/Z55XbWTW3Mzo1I5K8AjRdOYI=',
  'NWG-WGVME121': 'https://partner.leadersystems.com.au/products.html?o+5oh+clhY8=4G6+I9Zda4PaL7Fh85yRTA==jOyn3CaNFSQx8Pjiata+ogZ8tKM=',
  'NWG-WGVME131': 'https://partner.leadersystems.com.au/products.html?AzkuDGoMTbQ=S0Ahk1HpCEGrHk0V9Q6gMA==mLGCwRN4nXJacRyUuSlAasNhxwU=',
  'NWG-WGVME141': 'https://partner.leadersystems.com.au/products.html?yYoeKgUWxQc=uI6+KKVPh/j4b2yTV9mrqg==9lkZ9S9Dii7qv2JfUKStB2tVPqo=',
  'NWG-WGVME151': 'https://partner.leadersystems.com.au/products.html?oQ0fn9BpAzg=DVwaFSBztMaa/8a3GeKmNQ==MYqb02jHrzQNu7Nw9XetyICcuFM=',
  'NWG-WGVME171': 'https://partner.leadersystems.com.au/products.html?lsa1+qoFXrg=IxnJcap08wDeJvK8MyXS7w==x0hGKAtht4xHi5oo/oBJeQySLGg=',
  'NWG-WGVME173': 'https://partner.leadersystems.com.au/products.html?0BrrwL6W39w=a3gEfMOcyB7rrzYq+qkoHA==1m6JxYGmUZ2qn1eP2N9IXM4JsX4=',
  'NWG-WGVME181': 'https://partner.leadersystems.com.au/products.html?yqms0xNw5VI=Zm4kCYIFgCIo7SwFhljCmg==k7kjvVR+g1W140be387O6L22h68=',
  'NWG-WGVME521': 'https://partner.leadersystems.com.au/products.html?cXjN2/Jyszg=q4x9g9Egz4AgNTuElb/olw==sIAaTsN648Y6/MIDpL5KtXIJD4U=',
  'NWG-WGVME523': 'https://partner.leadersystems.com.au/products.html?klo0IonpuhE=5nA/pkxsasGlhiFV1V35Gg==EXAYH8/43h6nNvJn+S408sDT4do=',
  'NWG-WGVME061': 'https://partner.leadersystems.com.au/products.html?/6z3MyIyf3E=eNjudp1uOQtcIWYryHuhnw==P7Lq9AjDxD0w1PFK9Rq0x3JwlG4=',
  'NWG-WGVME063': 'https://partner.leadersystems.com.au/products.html?XkG5wnixFGM=gWXCIVQw8nnzfo6HxjFguw==mkWTHq2cLRkKMHD2OpnRiFO+0HA=',
  'NWG-WGVME671': 'https://partner.leadersystems.com.au/products.html?amWkT/eanF8=U8CDDNkY6/JR6MkdLlYJkQ==yDi57OUvXbxSTr0gQQ1MLE5Jjyw=',
  'NWG-WGVME673': 'https://partner.leadersystems.com.au/products.html?ZNb39VSyjLw=1vDefJEbR7yOJ8joKmQGHQ==PPWWcLG4DClPC+uBmVBFK8gnzW4=',
  // FireboxV Large
  'NWG-WGVLG001': 'https://partner.leadersystems.com.au/products.html?ta6RBw0l6V4=BiaEdRkI+ds/8HIlvNhDUQ==G+7Afs5Q7vNaYBcRNeUrBH2GoQI=',
  'NWG-WGVLG003': 'https://partner.leadersystems.com.au/products.html?cWrexnw7EK0=pN2Z0DDmwuX98YTFMR2m7w==qDkOHl1uMGTFW94+5oJtREc7csU=',
  'NWG-WGVLG031': 'https://partner.leadersystems.com.au/products.html?1Nw3oDqd1tU=9AXLMFys8TIN/CSNUtXY0Q==Ax0Q+VLDyBxzEbzCrvvy05BgqdY=',
  'NWG-WGVLG033': 'https://partner.leadersystems.com.au/products.html?nzer2lIe188=ItiVuqkGrYYvhu9t3ejs7w==vsgFG8t4S1Equ7bCkBCxi68GJoA=',
  'NWG-WGVLG641': 'https://partner.leadersystems.com.au/products.html?hgb75SEMjNs=A+2p2Wg204KpfeTRO2eYMQ==gix39cgPYQoUXMU/wkUpFuAQcyA=',
  'NWG-WGVLG643': 'https://partner.leadersystems.com.au/products.html?E0lXM1ZIr9Q=kEBN/NzEj5btWUMP8IPAnA==mJ8mGOoLnao6/Q2ELxkCSDkoLUs=',
  'NWG-WGVLG331': 'https://partner.leadersystems.com.au/products.html?caGijo/4Jsc=r8YVUTluFxzjW2zWSDj3Zw==k69Am1jgjSUMBJ7WWAh+KyF38uM=',
  'NWG-WGVLG333': 'https://partner.leadersystems.com.au/products.html?6avXXijegTQ=TvvZ7+rmS21ssuo4WAq8jA==Ta3IGIoqUTBZIhXGGc9AjC1k0yg=',
  'NWG-WGVLG351': 'https://partner.leadersystems.com.au/products.html?RA2VhEySICU=GLLun3h7y1c6/GCD4goggw==/raqqeaIS7OtWrLWxpFHxIpeg9I=',
  'NWG-WGVLG353': 'https://partner.leadersystems.com.au/products.html?gvhGnWl1J7A=Q7LSE7jZMB3M1KSETpOdgw==PRxtslrcB6vnBf66rYtOYb2uEFM=',
  'NWG-WGVLG201': 'https://partner.leadersystems.com.au/products.html?S1NfmRNdwTQ=vMmbQBfK9I+mgw/HHwZLuA==IyWc4yY49BbKu80RCbBIwyt69Dc=',
  'NWG-WGVLG203': 'https://partner.leadersystems.com.au/products.html?+KCMU69s490=7y0DJ1ZXhpghONsBlAAgYA==bEJ7U0RIJohMXxENz7Xnaiv8CJM=',
  'NWG-WGVLG261': 'https://partner.leadersystems.com.au/products.html?9JA78DwkfIE=OSAie/LKy1KZgNomYxBDug==i2LliQI0ZR13CzZEPHCFBJILBX0=',
  'NWG-WGVLG263': 'https://partner.leadersystems.com.au/products.html?gu+Fwx4NWXc=Q761N1jhzgrQrK/e81EQtA==62YDUJGkbvNHXPX/S5gaHFonP6w=',
  'NWG-WGVLG101': 'https://partner.leadersystems.com.au/products.html?JredOs1JEk8=/lf0vEM5Yg5At7Teb0S5/Q==vr7tM4m0UDY5TAdcrgMUJP2HjaM=',
  'NWG-WGVLG111': 'https://partner.leadersystems.com.au/products.html?kObFuC0fjAo=+atRqTueW7UV8AdkyLrikA==/THtPlGUDwOy/iqlAh7oLeK3JMM=',
  'NWG-WGVLG121': 'https://partner.leadersystems.com.au/products.html?mgNPNrWPWoQ=AeQeEw6k33KZAIGyWXGPtg==srKmWt+pHFUNdhF5+ZMOaUFq1as=',
  'NWG-WGVLG131': 'https://partner.leadersystems.com.au/products.html?R6Ll74XxT6s=mwEp1CiTagNwcX45hiEStw==OUxL5TYWMnCtKCYscviKBSHzPnc=',
  'NWG-WGVLG141': 'https://partner.leadersystems.com.au/products.html?+KEFM3v+cKw=bJpnTCEkVGwvl+gINodDlw==RPF7QqJJTOWiHIlFhrBV7624458=',
  'NWG-WGVLG151': 'https://partner.leadersystems.com.au/products.html?m3ZJshCdzdQ=QbAujkojRmtrj/vWcM1qgg==/r2Td+Am0SdMeHaUR7GxCoJUTXw=',
  'NWG-WGVLG171': 'https://partner.leadersystems.com.au/products.html?GUkDhnVT8zI=mwCrQFc/vh9GOnzo4KQD4w==T4LaavUcFWzHU5BrXK11+cBJv3I=',
  'NWG-WGVLG173': 'https://partner.leadersystems.com.au/products.html?RJ+DbqiT/3E=TUn22qp9HrC4Er/agGjOvQ==GMDgmEbTh1Sj8z6sYtJqtyb1IWw=',
  'NWG-WGVLG181': 'https://partner.leadersystems.com.au/products.html?MDoEeBaI7AE=kQbw4Tn/vBS+/YceWKgfHA==Tvq35lsh7TR4Bs46WtSjOhU5ieg=',
  'NWG-WGVLG521': 'https://partner.leadersystems.com.au/products.html?utwZ20hGt6A=iPetGGBp+Ex7nH8IUJGwuQ==ndPmzXVumVVoG2sAI9HYqJ3UL5o=',
  'NWG-WGVLG523': 'https://partner.leadersystems.com.au/products.html?xdt9KcSRNv8=QYyMIa8/WzvyBfYhP2ylTQ==25PEQ5OOB3+mAHyaH63AWDwNgD8=',
  'NWG-WGVLG061': 'https://partner.leadersystems.com.au/products.html?BLokvCTffAo=t4+a92yiXVWFfPebEUaZ7g==xScZvJTpG7UMSSuLG6w+f4zKdl8=',
  'NWG-WGVLG063': 'https://partner.leadersystems.com.au/products.html?zIWjhhfoSwI=LX/p2INOf1R4BQn09SvPNQ==kYX+OBgFPtJ1kcBK4XSnCU++Hn0=',
  'NWG-WGVLG671': 'https://partner.leadersystems.com.au/products.html?IH15Hmz778k=xg+hU2nG3PmL7+ORV4HuBA==kxPjv326dbW50J9cOY13zCx7zKU=',
  'NWG-WGVLG673': 'https://partner.leadersystems.com.au/products.html?CqOxd5tZF7A=E5SfQPkcWzArmGZu+1tTtA==x0T5YxBkrCvhoYanh6biD/VgMiw=',
  // FireboxV XLarge
  'NWG-WGVXL001': 'https://partner.leadersystems.com.au/products.html?eBFmkJmYiOc=AD1GJK+nvdvlgFQ0ifF+9Q==41uuV32kaqTpoN1PjPH5xlJnmYo=',
  'NWG-WGVXL003': 'https://partner.leadersystems.com.au/products.html?xJyEr41J8NI=kGBbdIFSp6pnCRTav6YctA==mDiRi/GA9RMHMVc9fXYZX0XsLjU=',
  'NWG-WGVXL031': 'https://partner.leadersystems.com.au/products.html?P/8wiL+WHyk=etf0GisfK8tJChT7gRUHHw==3SZgyX9WW0x6HX6BjiWSYJI8YM4=',
  'NWG-WGVXL033': 'https://partner.leadersystems.com.au/products.html?d+2GixB1GGc=1oqi2SOOZBiaJFOuuHlkQg==LIfJEgkZQo+3Z7B+2/eYMd988yQ=',
  'NWG-WGVXL641': 'https://partner.leadersystems.com.au/products.html?S0BIc7xU7y8=pnGclKlpWXuqzYylihzKig==v4/TEhs1MYic9lbPcmd1hCvj9Cs=',
  'NWG-WGVXL643': 'https://partner.leadersystems.com.au/products.html?AULIsyyymWM=NJqxK0U/V4R4Aajf6pGmXQ==5eaT1fhssbMAUh1UgJXr8+lFNzY=',
  'NWG-WGVXL331': 'https://partner.leadersystems.com.au/products.html?+Xqu08/ithc=8qleeq7bHixzyYElCy39KA==bmnx/MQgYnOKyTpo9GV3v5Pm6Uw=',
  'NWG-WGVXL333': 'https://partner.leadersystems.com.au/products.html?QqJ20nz8nkI=mJlfv/qAzJ9rLSYz4b3a6g==OwrSPjKfxGW7kL6G4v0arSqDnxQ=',
  'NWG-WGVXL351': 'https://partner.leadersystems.com.au/products.html?+vYkz6XoVfo=pYipNyuzTkw/sPo8OT2LlQ==a0MMvEOa1UCrRJPIk5lHBOr9rH4=',
  'NWG-WGVXL353': 'https://partner.leadersystems.com.au/products.html?BDR58tlGOaQ=DTOdDKPmAIk4hXRxsjhE1w==WwHp4rMe4uAhvs5EZAbjTYv9E9w=',
  'NWG-WGVXL201': 'https://partner.leadersystems.com.au/products.html?WOvJPQmbNNc=ufkcVRfMN19VtTQaX4iL3w==UHm8SifEtlzCNGUjaKDfC037fOA=',
  'NWG-WGVXL203': 'https://partner.leadersystems.com.au/products.html?zLME1BYjBZw=fbfSvb7tcIKNLvDNR48ruQ==dz9gSQoYRZ1HvG8/EmKQiZ9CVy8=',
  'NWG-WGVXL261': 'https://partner.leadersystems.com.au/products.html?OAbHIiB2Mfw=ZGUB9m9QKhfpzPpMjtq7Zg==cOODJONh/W9as9qHnWOyw71XcsQ=',
  'NWG-WGVXL263': 'https://partner.leadersystems.com.au/products.html?lxGuNf7QSyY=UTKBKhuHG8KvGu774YwUiw==zlI8t349OB9SNWSIeDrQPJMUg4I=',
  'NWG-WGVXL101': 'https://partner.leadersystems.com.au/products.html?xZ2N4nvXtEQ=znpyJw0hAofJvdkwlQhLEw==DAhrHfyMShrnOD24HSHBvHsat9I=',
  'NWG-WGVXL111': 'https://partner.leadersystems.com.au/products.html?amHjLKtZhpc=izU6jjYVtaneA6nHNpK7bg==iWc1NCABkTviE3Zuje/t6go51eU=',
  'NWG-WGVXL121': 'https://partner.leadersystems.com.au/products.html?hSQUmGoBRgE=onZ+Z/iEZX6FrWxG94sqow==Et2jyVc7/z613cvmcNfI2gpMyJo=',
  'NWG-WGVXL131': 'https://partner.leadersystems.com.au/products.html?v8yNT29sm24=rrr+5TO0y9XVDyvh5rMVxQ==bhEZUAtiw29jnS+eGk8SpB0Mccs=',
  'NWG-WGVXL141': 'https://partner.leadersystems.com.au/products.html?mPgOnDlL7hw=FJXQyTXoVTYuZVwq5sEf5g==KI7lgdURGNpm2YgQ48xmbEQgazM=',
  'NWG-WGVXL151': 'https://partner.leadersystems.com.au/products.html?C2FOjhuH1NU=u9auqKyzPhpJ7g/ciPqoOQ==ku/S8IoEj9RfDR1Ui9/Tnq4tLmk=',
  'NWG-WGVXL171': 'https://partner.leadersystems.com.au/products.html?Lo54hx9tzqg=t4hARpb9F5ZdfFGk09xhnw==ck9nxBbPj70OGRsSkRXTxHc/414=',
  'NWG-WGVXL173': 'https://partner.leadersystems.com.au/products.html?4fj8FxphehE=SK238QP1DlVIlhcKXlBkfA==0ky2zMR3OZqNud/DROXo/fOY7eM=',
  'NWG-WGVXL181': 'https://partner.leadersystems.com.au/products.html?oQlymcDi6E8=OMkEehAc0nhMeTbXMRkG+A==JYHBYGWlCh4m2jCttxkNxEVbpJw=',
  'NWG-WGVXL521': 'https://partner.leadersystems.com.au/products.html?A3DpnUsn380=VgFtaRo2jwaH3hX8Qikw6Q==VWaKeSFvvQNOPStaoUO1Wm06e4Q=',
  'NWG-WGVXL523': 'https://partner.leadersystems.com.au/products.html?omvMdM3haGo=slEi45QOeaAMgYR0AiFLJA==SQ4I5FVT8emuhJ9l1+K70b3WBaQ=',
  'NWG-WGVXL061': 'https://partner.leadersystems.com.au/products.html?y/5y94mvmbc=lovUyaJonQnW2WIYB7XKoA==2ioxK+SXeJcrWBTD1Hb+FbJvAQo=',
  'NWG-WGVXL063': 'https://partner.leadersystems.com.au/products.html?3YfNKqQyOdM=NZJADKcwEiRRnyNvu7xB/A==jbJjTzcaJhycvDZzJw4qIMhwDJk=',
  'NWG-WGVXL671': 'https://partner.leadersystems.com.au/products.html?J+osQmkGmoI=0x1Dp2s666uaz4005QBaqA==wJnpZF/cynkpgB35xqTDRIYxn+4=',
  'NWG-WGVXL673': 'https://partner.leadersystems.com.au/products.html?ilrWQWfLUTc=Iru3gnch/zSUoH0i/ENEOw==75GtESyAmVkeqvYhFIcF7HLAQO4=',
};

function getSkuUrl(sku) {
  return SKU_URLS[sku] || '';
}

/* ─── Reusable SKU link ─── */
function SkuLink({ sku }) {
  if (!sku) return null;
  const url = getSkuUrl(sku);
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.skuLink}>
        {sku}
      </a>
    );
  }
  return <span className={styles.skuCode}>{sku}</span>;
}

/* ─── Hero quick-nav items ─── */
const SECTION_NAV = [
  { id: 'purchase', label: 'New Purchase', Icon: ShoppingBagOpen },
  { id: 'renewals', label: 'Suite Renewals', Icon: ArrowsClockwise },
  { id: 'support', label: 'Support Renewals', Icon: Headset },
  { id: 'individual', label: 'Individual Subs', Icon: ListChecks },
  { id: 'tradeup', label: 'Trade-Up', Icon: TrendUp },
  { id: 'cloud', label: 'Cloud Retention', Icon: Cloud },
];

/* ─── Drag-scroll for horizontal scroll container ─── */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const down = (e) => {
      if (e.target.closest('button, select, a, input')) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const end = () => { isDown = false; el.style.cursor = 'grab'; };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
    };
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', move);
    return () => {
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseleave', end);
      el.removeEventListener('mouseup', end);
      el.removeEventListener('mousemove', move);
    };
  }, [ref]);
}

/* ═══════════════════════════════════════════════════════════
   Card-based accordion section (cloud, trade-up, individual)
   ═══════════════════════════════════════════════════════════ */
function ServiceSection({ id, title, description, sectionId, options, data, onAdd, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const { MODELS, selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;

  return (
    <section id={id} className={styles.serviceSection}>
      <button
        className={styles.sectionToggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className={styles.sectionToggleText}>
          <span className={styles.sectionToggleTitle}>{title}</span>
          {description && <span className={styles.sectionToggleDesc}>{description}</span>}
        </div>
        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}>
          <CaretDown size={16} weight="bold" />
        </span>
      </button>

      {expanded && (
        <div className={styles.cardGrid}>
          {MODELS.map((model) => {
            const sel = selections[model.key]?.[sectionId] || {};
            const serviceType = sel.serviceType || options[0]?.key;
            const availableTerms = getAvailableTerms(model.key, serviceType);
            const term = sel.term || availableTerms[0];
            const sku = getSkuForSelection(model.key, serviceType, term);
            const price = getPriceForSelection(model.key, serviceType, term);

            return (
              <div key={`${sectionId}-${model.key}`} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardModelLabel}>FireboxV {model.label}</span>
                  <span className={styles.cardModelDesc}>{model.description}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardSelects}>
                    <select
                      className={styles.cardSelect}
                      value={serviceType}
                      onChange={(e) => setSelection(model.key, sectionId, 'serviceType', e.target.value)}
                    >
                      {options.map((opt) => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                    {availableTerms.length > 0 && (
                      <select
                        className={styles.cardSelect}
                        value={term}
                        onChange={(e) => setSelection(model.key, sectionId, 'term', e.target.value)}
                      >
                        {availableTerms.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className={styles.subPrice}>
                    {formatPrice(price)}
                    <span className={styles.priceNote}>MSRP</span>
                  </div>
                  <button
                    className={styles.addSubBtn}
                    disabled={!sku}
                    onClick={() =>
                      onAdd({
                        sku,
                        name: `FireboxV ${model.label}`,
                        description: `${serviceType} (${term})`,
                        unitPrice: price || 0,
                      })
                    }
                    title="Add to quote cart"
                  >
                    <ShoppingCartSimple size={14} weight="bold" />
                    Add to Cart
                  </button>
                  <SkuLink sku={sku} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Renewal Configurator — image-left / config-right (50/50 column)
   Used for Suite Renewals and Support Renewals (no accordion)
   ═══════════════════════════════════════════════════════════ */
function RenewalConfigurator({ id, title, description, sectionId, options, data, onAdd, suiteLabel = 'Security Suite', termLabel = 'Select Term' }) {
  const { MODELS, selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const sel = selections[MODELS[0]?.key]?.[sectionId] || {};
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const serviceType = sel.serviceType || options[0]?.key;
  const modelSel = selections[selectedModel]?.[sectionId] || {};
  const activeServiceType = modelSel.serviceType || options[0]?.key;
  const availableTerms = getAvailableTerms(selectedModel, activeServiceType);
  const activeTerm = modelSel.term || availableTerms[0];
  const sku = getSkuForSelection(selectedModel, activeServiceType, activeTerm);
  const price = getPriceForSelection(selectedModel, activeServiceType, activeTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : MODEL_IMAGES[selectedModel];

  return (
    <section id={id} className={styles.renewalSection}>
      <div className={styles.renewalHeader}>
        <h2 className={styles.renewalTitle}>{title}</h2>
        <p className={styles.renewalDesc}>{description}</p>
      </div>
      <div className={styles.renewalBody}>
        <div className={styles.renewalConfigSide}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select FireboxV Model</label>
            <select
              className={styles.renewalSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.key} value={m.key}>FireboxV {m.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{suiteLabel}</label>
            <select
              className={styles.renewalSelect}
              value={activeServiceType}
              onChange={(e) => setSelection(selectedModel, sectionId, 'serviceType', e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
          {availableTerms.length > 0 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{termLabel}</label>
              <select
                className={styles.renewalSelect}
                value={activeTerm}
                onChange={(e) => setSelection(selectedModel, sectionId, 'term', e.target.value)}
              >
                {availableTerms.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.renewalPriceRow}>
            <span className={styles.renewalPrice}>{formatPrice(price)}</span>
            <span className={styles.priceNote}>MSRP</span>
          </div>
          <button
            className={styles.addSubBtn}
            disabled={!sku}
            onClick={() =>
              onAdd({
                sku,
                name: `FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`,
                description: `${activeServiceType} (${activeTerm})`,
                unitPrice: price || 0,
              })
            }
            title="Add to quote cart"
          >
            <ShoppingCartSimple size={14} weight="bold" />
            Add to Cart
          </button>
          <SkuLink sku={sku} />
        </div>
        <div className={styles.renewalImageSide}>
          <img
            src={imageUrl}
            alt={`${activeServiceType} — FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`}
            className={styles.renewalImage}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Individual subscriptions — 4×2 card grid per subscription
   ═══════════════════════════════════════════════════════════ */
const SUB_DESCRIPTIONS = {
  'WebBlocker': 'URL/content filtering to block access to malicious and inappropriate websites',
  'spamBlocker': 'Real-time spam detection and filtering for inbound email traffic',
  'Gateway AntiVirus': 'Signature-based antivirus scanning at the gateway to catch known threats',
  'Intrusion Prevention Service': 'Network-based IPS to detect and block exploit attempts in real time',
  'Reputation Enabled Defense': 'Cloud-based reputation lookup to block traffic from known bad sources',
  'Application Control': 'Granular control over 1,800+ applications to enforce usage policies',
  'APT Blocker': 'Full-system sandbox analysis to identify advanced zero-day malware',
  'Network Discovery': 'Visibility into all devices and services on your network topology',
};

function IndividualSubCard({ sub, data, onAdd }) {
  const { MODELS, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const terms = getAvailableTerms(selectedModel, sub.key);
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || '1 Year');

  // Reset term when model changes
  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    const newTerms = getAvailableTerms(model, sub.key);
    setSelectedTerm(newTerms[0] || '1 Year');
  };

  const sku = getSkuForSelection(selectedModel, sub.key, selectedTerm);
  const price = getPriceForSelection(selectedModel, sub.key, selectedTerm);
  const imageUrl = sku
    ? `https://www.leadersystems.com.au/Images/${sku}.jpg`
    : null;

  return (
    <div id={`sub-card-${sub.key}`} className={styles.indCard}>
      {imageUrl && (
        <div className={styles.indCardImageWrap}>
          <img src={imageUrl} alt={sub.label} className={styles.indCardImage} />
        </div>
      )}
      <div className={styles.indCardBody}>
        <h3 className={styles.indCardName}>{sub.label}</h3>
        <p className={styles.indCardDesc}>{SUB_DESCRIPTIONS[sub.key] || ''}</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>FireboxV Model</label>
          <select
            className={styles.renewalSelect}
            value={selectedModel}
            onChange={handleModelChange}
          >
            {MODELS.map((m) => (
              <option key={m.key} value={m.key}>FireboxV {m.label}</option>
            ))}
          </select>
        </div>
        {terms.length > 0 && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subscription Term</label>
            <select
              className={styles.renewalSelect}
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.renewalPriceRow}>
          <span className={styles.renewalPrice}>{formatPrice(price)}</span>
          <span className={styles.priceNote}>MSRP</span>
        </div>
        <button
          className={`${styles.addSubBtn} ${styles.indCardBtn}`}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: `FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`,
              description: `${sub.label} (${selectedTerm})`,
              unitPrice: price || 0,
            })
          }
          title="Add to quote cart"
        >
          <ShoppingCartSimple size={14} weight="bold" />
          Add to Cart
        </button>
        <SkuLink sku={sku} />
      </div>
    </div>
  );
}

function IndividualSubsSection({ id, data, onAdd }) {
  const { SECTIONS } = data;
  const subs = SECTIONS.individual;

  const handleScrollToSub = (key) => {
    const el = document.getElementById(`sub-card-${key}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id={id} className={styles.indSection}>
      <div className={styles.indSectionHeader}>
        <h2 className={styles.renewalTitle}>Individual Subscriptions</h2>
        <p className={styles.renewalDesc}>Add individual security services à la carte</p>
      </div>
      <BannerCarousel onScrollTo={handleScrollToSub} />
      <div className={styles.indGrid}>
        {subs.map((sub) => (
          <IndividualSubCard key={sub.key} sub={sub} data={data} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main VirtualCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function VirtualCatalog() {
  const data = useFireboxVData();
  const { MODELS, SECTIONS, selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const { addItem } = useQuote();
  const scrollRef = useRef(null);
  const [specsOpen, setSpecsOpen] = useState(true);

  useDragScroll(scrollRef);

  const specSections = SECTION_DEFS.fireboxV || [];
  const gridCols = `200px repeat(${MODELS.length}, 220px)`;

  const handleAdd = (item) => addItem(item);

  return (
    <div className={styles.catalog}>
      {/* ─── Hero Section Navigation ─── */}
      <nav className={styles.sectionNav}>
        {SECTION_NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={styles.navItem}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Icon size={18} weight="duotone" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.header}>
        <h1>FireboxV Virtual Appliances</h1>
        <p className={styles.intro}>
          WatchGuard FireboxV brings best-in-class network security to virtualised environments.
          Choose a size based on your user count and performance needs.
        </p>
      </div>

      {/* ═══ COMPARISON GRID ═══ */}
      <div className={styles.tableWrapper} ref={scrollRef}>
        <div className={styles.grid} style={{ gridTemplateColumns: gridCols }}>
          {/* ── Product Header Row ── */}
          <div className={styles.headerLabel} />
          {MODELS.map((model) => (
            <div key={model.key} className={styles.productCard}>
              <img
                src={MODEL_IMAGES[model.key]}
                alt={`FireboxV ${model.label}`}
                className={styles.productImage}
              />
              <div className={styles.productName}>FireboxV {model.label}</div>
              <div className={styles.productDesc}>{model.description}</div>
            </div>
          ))}

          {/* ── New Purchase Options (matches Security Appliances licence row) ── */}
          <div className={styles.subLabelCell} id="purchase">
            <div>
              New Purchase Options
              <a
                href="#security-suites"
                className={styles.bundlesLink}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('security-suites')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                What are the WatchGuard security service bundles?
              </a>
            </div>
          </div>
          {MODELS.map((model) => {
            const sel = selections[model.key]?.purchase || {};
            const options = SECTIONS.purchase;
            const serviceType = sel.serviceType || options[0]?.key;
            const availableTerms = getAvailableTerms(model.key, serviceType);
            const term = sel.term || availableTerms[0];
            const sku = getSkuForSelection(model.key, serviceType, term);
            const price = getPriceForSelection(model.key, serviceType, term);

            return (
              <div key={`purchase-${model.key}`} className={styles.subCell}>
                <select
                  className={styles.subSelect}
                  value={serviceType}
                  onChange={(e) => setSelection(model.key, 'purchase', 'serviceType', e.target.value)}
                >
                  {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
                {availableTerms.length > 0 && (
                  <select
                    className={styles.subSelect}
                    value={term}
                    onChange={(e) => setSelection(model.key, 'purchase', 'term', e.target.value)}
                  >
                    {availableTerms.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
                <div className={styles.subPrice}>
                  {formatPrice(price)}
                  <span className={styles.priceNote}>MSRP</span>
                </div>
                <button
                  className={styles.addSubBtn}
                  disabled={!sku}
                  onClick={() =>
                    handleAdd({
                      sku,
                      name: `FireboxV ${model.label}`,
                      description: `${serviceType} (${term})`,
                      unitPrice: price || 0,
                    })
                  }
                  title="Add to quote cart"
                >
                  <ShoppingCartSimple size={14} weight="bold" />
                  Add to Cart
                </button>
                <SkuLink sku={sku} />
              </div>
            );
          })}
        </div>

        {/* ─── Collapsible Specs ─── */}
        <button className={styles.specsToggle} onClick={() => setSpecsOpen(!specsOpen)}>
          Compare Specs
          <span className={`${styles.chevron} ${specsOpen ? styles.chevronOpen : ''}`}>
            <CaretDown size={14} weight="bold" />
          </span>
        </button>

        <div className={`${styles.collapseWrapper} ${specsOpen ? styles.collapseOpen : ''}`}>
          <div className={styles.collapseInner}>
            <div className={styles.specsGrid} style={{ gridTemplateColumns: gridCols }}>
              {specSections.map((section, sIdx) => (
                <React.Fragment key={`sec-${sIdx}`}>
                  <div className={styles.sectionHeader}>{section.title}</div>
                  {MODELS.map((model) => (
                    <div
                      key={`sechdr-${sIdx}-${model.key}`}
                      className={styles.sectionHeaderSpacer}
                    />
                  ))}
                  {section.rows.map((row, rIdx) => (
                    <React.Fragment key={`row-${sIdx}-${rIdx}`}>
                      <div className={styles.featureLabel}>{row.label}</div>
                      {MODELS.map((model) => (
                        <div key={`${row.key}-${model.key}`} className={styles.cell}>
                          {getSpecValue(SPEC_SLUGS[model.key], row.key)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RENEWAL CONFIGURATORS (50/50 two-column) ═══ */}
      <div className={styles.renewalRow}>
        <RenewalConfigurator
          id="renewals"
          title="Security Suite Renewals"
          description="Renew Basic Security or Total Security Suite"
          sectionId="renewal"
          options={SECTIONS.renewal}
          data={data}
          onAdd={handleAdd}
        />
        <RenewalConfigurator
          id="support"
          title="Support Renewals"
          description="Renew Standard or Gold Support plans"
          sectionId="support"
          options={SECTIONS.support}
          data={data}
          onAdd={handleAdd}
          suiteLabel="Support Level"
        />
      </div>

      <div className={styles.renewalRow}>
        <RenewalConfigurator
          id="cloud"
          title="Cloud Data Retention"
          description="Extend cloud log and report data retention"
          sectionId="cloud"
          options={SECTIONS.cloud}
          data={data}
          onAdd={handleAdd}
          termLabel="Cloud Data Retention"
        />
        <RenewalConfigurator
          id="tradeup"
          title="Trade-Up Options"
          description="Trade up from Standard Support to a Security Suite"
          sectionId="tradeUp"
          options={SECTIONS.tradeUp}
          data={data}
          onAdd={handleAdd}
          suiteLabel="Trade-up Suite"
        />
      </div>

      {/* ═══ INDIVIDUAL SUBSCRIPTIONS (card grid — 4×2) ═══ */}
      <IndividualSubsSection id="individual" data={data} onAdd={handleAdd} />

      {/* ═══ INFO SECTIONS ═══ */}
      <div className={styles.infoSection} id="security-suites">
        <SecuritySuiteTable />

        <div className={styles.infoBlock}>
          <h3>About WatchGuard FireboxV</h3>
          <p>
            FireboxV delivers enterprise-grade security in a virtualised form factor, making it
            ideal for cloud deployments, virtual data centres, and multi-tenant environments.
            All FireboxV models include the same comprehensive security services available on
            physical Firebox appliances.
          </p>
          <h3>Supported Hypervisors</h3>
          <ul className={styles.hypervisorList}>
            <li>VMware ESXi</li>
            <li>Microsoft Hyper-V</li>
            <li>KVM (Linux)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
