import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCartSimple,
  CaretDown,
  ShoppingBagOpen,
  ArrowsClockwise,
  Headset,
  ListChecks,
  TrendUp,
  Cloud,
} from '@phosphor-icons/react';
import styles from '../VirtualCatalog/VirtualCatalog.module.css';
import { useFireboxCloudData } from './hooks/useFireboxCloudData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';
import SecuritySuiteTable from '../SecuritySuiteTable/SecuritySuiteTable.jsx';
import { SECTION_DEFS, getSpecValue } from '../../data/featureSpecs.shared.js';
import CloudBannerCarousel from './CloudBannerCarousel.jsx';

// SKU → URL mapping (Leader partner portal links)
const SKU_URLS = {
  'NWG-WGCLG001': 'https://partner.leadersystems.com.au/products.html?bMhG2pFiTts=tAbjeuIEbei9kQgMRrwKhQ==u1PdMDv7QDAElHwu7N5D1KTAUg4=',
  'NWG-WGCLG003': 'https://partner.leadersystems.com.au/products.html?wpm082QBAhw=PgLOqp2I3wVznKcbF1YswA==jZqRQEwUCDKNFL1YNLyKyEknE2k=',
  'NWG-WGCLG031': 'https://partner.leadersystems.com.au/products.html?nPIHd5ePK1U=BrUu89NJ9rboOTAsWcmhVA==cL5LXBZdjVavWImrRHYbcRb9G88=',
  'NWG-WGCLG033': 'https://partner.leadersystems.com.au/products.html?caGtG/SPnQA=hnjmkuaJ5A4hqzkrIA+jTg==cYBlepbP6WYZJniIOVwol6sYbns=',
  'NWG-WGCLG061': 'https://partner.leadersystems.com.au/products.html?VE/+Esav3v0=goqXCxrJDctRJGdAIB2AYA==D6diGK+WkKnHYNa1pETata8V+aw=',
  'NWG-WGCLG063': 'https://partner.leadersystems.com.au/products.html?gpxT7X1BJFg=xapKRmeYn2HuyyoG8elV+A==S5Nt3afuJUoKxLjzlLpOJqg/Vns=',
  'NWG-WGCLG101': 'https://partner.leadersystems.com.au/products.html?4rQPCJdgmX0=Q0GYD1QvmLXPm2zXOqVZDw==sp7J8q7oLdOAHAl6XGZNjT6A0C4=',
  'NWG-WGCLG121': 'https://partner.leadersystems.com.au/products.html?PnsD8nO2LeA=fP1Hg+CJatefFDPcmzQnVw==fCcz1NC/MLhCNj59EfE/oljnYNI=',
  'NWG-WGCLG131': 'https://partner.leadersystems.com.au/products.html?7uS/ZDKA2Pg=i9Q6jPut5zBRfxR6xVMdAg==TtObkhWBD8kExMVF/DL2lRSYOr4=',
  'NWG-WGCLG141': 'https://partner.leadersystems.com.au/products.html?09VCs4TQ4q8=i9BnStJXwsiXNnbUKPNbmA==x1f/Co1yzuVLbjgEFE3515W29IQ=',
  'NWG-WGCLG151': 'https://partner.leadersystems.com.au/products.html?SOxrQEfAmqI=3sD0YKMy76T+6l3t8NmqIA==J1WFrBIMltO9Avy/wtIkTKE9kGk=',
  'NWG-WGCLG171': 'https://partner.leadersystems.com.au/products.html?TsV1u/9QWjU=GiSxgLqc8p2VpA7L5kOCmA==WA5DNZ+nM0g6q2xkNATRujh4D/I=',
  'NWG-WGCLG173': 'https://partner.leadersystems.com.au/products.html?p/Ir6r6zvBs=7SB5gfIIEcPOq+NvYqktiA==tcZJPZt39tyCo/0sND1VPBK+2L0=',
  'NWG-WGCLG201': 'https://partner.leadersystems.com.au/products.html?nZJ1d37jZlU=UfA6KoeCn9Rht02zmf9bBA==nPQ0vWS4C5yF5xVgnhBrT4/nDaE=',
  'NWG-WGCLG203': 'https://partner.leadersystems.com.au/products.html?6uSknYxcLmc=zcXCJEDZ8JGFaTS13YBnkw==Xy5FUmw4/dSWrEtr0Y+RHei5/RI=',
  'NWG-WGCLG261': 'https://partner.leadersystems.com.au/products.html?Sw8JmrH6N+A=ng3DAjobhqIuHB2YrhLKZA==lhaZkJGr0a/fFqsXo6r3XVcns2E=',
  'NWG-WGCLG263': 'https://partner.leadersystems.com.au/products.html?tyDKEgDO/Gw=uXV0+EvrvIeLPrqYGXprvw==99po+2wR7x6ZGeGTdlvO+ql6oZE=',
  'NWG-WGCLG331': 'https://partner.leadersystems.com.au/products.html?hQyffW7bu3A=YGLYBL86/mbTSdmAygrviA==OVC4STkhkWzCLFdut7SW+vvQ5lI=',
  'NWG-WGCLG333': 'https://partner.leadersystems.com.au/products.html?A8Ve9KP3c/o=hTD+H8ZNMaDWdZAlsXA6NA==7racdIwKkOrQixdopuTgcAQEtG4=',
  'NWG-WGCLG351': 'https://partner.leadersystems.com.au/products.html?BhB3RBWjylw=wMDtlP6Rv7P0FB4oBhuFIA==+XdvUCo53l0pKtjNak5OuMN+0lc=',
  'NWG-WGCLG353': 'https://partner.leadersystems.com.au/products.html?yQi6SmmPgH4=uDZka21i6PFwWs/Bt9M7PQ==mypiH1h9cAvr9sKH5YNzy7R77rk=',
  'NWG-WGCLG521': 'https://partner.leadersystems.com.au/products.html?GmPk1KBOso0=nPj69iyRE/srtA9/YjCTtA==SzgIEjDWLhC5kzGYYDuoftJsr68=',
  'NWG-WGCLG523': 'https://partner.leadersystems.com.au/products.html?kwQR7qJNJ+Y=I8h7QTetelaKauVGf7N6DA==EWsOOAG6AlNnZjczAkQFCrnFEu4=',
  'NWG-WGCLG641': 'https://partner.leadersystems.com.au/products.html?adRbxbM0shE=D5BFovNTCQRCZ5kRogCoRQ==BUWrphoAMMR9Z1IXuHuCyRU0R0o=',
  'NWG-WGCLG643': 'https://partner.leadersystems.com.au/products.html?3p2AJURLOG0=/1vbP+83PXqpMxBIWHKHpw==TRShVdkyCPu/EpYa4pxtFaXNPrA=',
  'NWG-WGCLG671': 'https://partner.leadersystems.com.au/products.html?oIgVSPpIP0M=MRPLH5LxOP4CVSQocDPEdg==hxxPyvAAsqoRr7fSNelfbm8Qndo=',
  'NWG-WGCLG673': 'https://partner.leadersystems.com.au/products.html?2JL6oMw8BXM=KWMCd0QqG8+eU6JPtgnSmw==sRmc/NmYR0e4TSB2vEypgPJhqIM=',
  'NWG-WGCME001': 'https://partner.leadersystems.com.au/products.html?akOKRznVjNs=u3Nurdw3LIef1S9Z780YBA==ro7qlxrNOcGKpmju2WpuzwjiaZU=',
  'NWG-WGCME003': 'https://partner.leadersystems.com.au/products.html?Way13OHKSs0=I69sh3n3XUlYWymCokf3/Q==Rb9P4ri41ZHvzYUgUjr9WXZXTxU=',
  'NWG-WGCME031': 'https://partner.leadersystems.com.au/products.html?tHdvILHq+VY=IT+U5C8y3kZ+hQ8JoUVlJw==bazHCwhw/3ejXT5Re1CZtSo3E5c=',
  'NWG-WGCME033': 'https://partner.leadersystems.com.au/products.html?gCW6yE1biFc=PgSqr02eZcuFKRbsqrj7Cg==AxbTagD/VqCYZpu/lqRV8H56V5M=',
  'NWG-WGCME061': 'https://partner.leadersystems.com.au/products.html?l/VLdKmCTXg=bxJ2M/FnqPwKU22ikIaVFQ==U6BLr8tD/IEJnZMeH60H6TA8VOQ=',
  'NWG-WGCME063': 'https://partner.leadersystems.com.au/products.html?XbqTP8pdc1A=8GyaBvQVTsSkuDlPr66dfA==P1WdhutDCEzQatv11P9MNbYhuo8=',
  'NWG-WGCME101': 'https://partner.leadersystems.com.au/products.html?U5l5FjwGVDA=BFGz0UOeXwRy+YVCZ/sZnQ==GQM6j/8LnnjTfOM/VhuxUT26vfI=',
  'NWG-WGCME121': 'https://partner.leadersystems.com.au/products.html?mQnk2zVBFiw=YixNENJtW2Vcj6hNecJXWw==ObbNEBqmZUCzyeFBnuKQ53OB8qY=',
  'NWG-WGCME131': 'https://partner.leadersystems.com.au/products.html?Gp0+SaEVoiY=FiS1pmIDWrtamluL12pB8g==j3H8B9FqQquDhDQnU9QKNXhRD7E=',
  'NWG-WGCME141': 'https://partner.leadersystems.com.au/products.html?/5pVXsxvkH4=P50RiyUi8W1wVIhrCA8wwg==cpQ+Ixf3v0nEcM4J1eJHJMR2pJA=',
  'NWG-WGCME151': 'https://partner.leadersystems.com.au/products.html?d0vTrnzaVG8=WPsCoyXMMe4+1YxiCmQuaA==hPWIl3McryHOtBGk7lLOkwXe+os=',
  'NWG-WGCME171': 'https://partner.leadersystems.com.au/products.html?Qc4ytml4cag=LWLDSXdXnnFnDUJ0+6ndKw==LN5PUfBSGYN5t6pE816+ieHrxZU=',
  'NWG-WGCME173': 'https://partner.leadersystems.com.au/products.html?G0mmcUkLXSg=5huTm10/sVcgSSp6ih5Imw==yl9hvdIpnE5iW0/IlQszA9wKmuQ=',
  'NWG-WGCME201': 'https://partner.leadersystems.com.au/products.html?NGJonghaSI4=cDqqiijFFlPYZdHRU4+fAg==fY8ft8brp8Fa/I1mecih+BnwQ0A=',
  'NWG-WGCME203': 'https://partner.leadersystems.com.au/products.html?pQBfFhEpUX8=O8+OtXfjmQ02Dag9+AITlw==rOrg2grjISFD/tQT3c3rSKW+iDc=',
  'NWG-WGCME261': 'https://partner.leadersystems.com.au/products.html?oLN1leT10fs=wNFH07J7hnQS9nt9GFvoow==i/qmj/TFcX1apPtwsqLnCDmia5Y=',
  'NWG-WGCME263': 'https://partner.leadersystems.com.au/products.html?CnSbqK0Chss=Y1gILij+0ht/tJiupUtTcA==doAVAmHyvK2p0WGIBky2nMjFFKU=',
  'NWG-WGCME331': 'https://partner.leadersystems.com.au/products.html?2Gcjbz9CP+w=xWigUJeAekMDvVW6WEGN6A==ePYPFK8nWX8pPMpVDyzejP80AiY=',
  'NWG-WGCME333': 'https://partner.leadersystems.com.au/products.html?9rBpxS57HNA=PXppISkH2u/1GV71+vdyyg==H5YLXHrxmW7jc0YPubNWkoDkYjI=',
  'NWG-WGCME351': 'https://partner.leadersystems.com.au/products.html?J1x7u0D/bm0=03vKD0GoDhb+gdG1k1y9Iw==/uIfRNN704QH1n0bfsdcm6bQtZE=',
  'NWG-WGCME353': 'https://partner.leadersystems.com.au/products.html?i/lkziru+5Y=IA/ERvDNccCNphavP9LdAw==2MU/5gm/qJrWROsuZgdEO09bsiY=',
  'NWG-WGCME521': 'https://partner.leadersystems.com.au/products.html?jI+mLobOCrg=SZIeNRJR22x4n+KGH7UBmQ==Z/KbjIvzbxRyIOdzgTzJaUTSww8=',
  'NWG-WGCME523': 'https://partner.leadersystems.com.au/products.html?Q7Z7Hm9wMxE=52zvGKwdPXT5cf+YDPV0zw==z6E3jtZy4eW0WyXrVjv/AnkETto=',
  'NWG-WGCME641': 'https://partner.leadersystems.com.au/products.html?w9n+4kqCv5Q=WifgUp3o2AaSzJ3Jxg6mVg==Zewry156j4HF10Hl7dEWdJe1xtE=',
  'NWG-WGCME643': 'https://partner.leadersystems.com.au/products.html?NUY9MfHXiEU=zyij05n4WJOczlDopO3d2A==HlQuzVpJAaq6Oj0bBf7YWTp4gig=',
  'NWG-WGCME671': 'https://partner.leadersystems.com.au/products.html?FM+rR0jPyWw=P0XPdKGOKR00dXByfrap7w==cVbLXcG4OKCkVRMCrDbckSom+Ow=',
  'NWG-WGCME673': 'https://partner.leadersystems.com.au/products.html?u+9eITgtPpI=l/366sdOsnYAzqn9kSJz/g==nYRUUhLEruNiOdXcPYKQbVoFqA4=',
  'NWG-WGCSM001': 'https://partner.leadersystems.com.au/products.html?zVlHisgGANA=P1BPIcxUASSwrGkECfy8dw==zYszWa6/C7O4QCTkbgY7ZGYrdmE=',
  'NWG-WGCSM003': 'https://partner.leadersystems.com.au/products.html?tk24H6lUXl4=fTFSVSj7iuRwYimBesd1bQ==Hv2+kj2CeKy7AZtg4Blt79aVH44=',
  'NWG-WGCSM031': 'https://partner.leadersystems.com.au/products.html?XCDykb/GhsA=QJbM99i4GhUO9W9AB+13Tw==/IcX+Z/gC2+cnsUJB8PvN0g3aXY=',
  'NWG-WGCSM033': 'https://partner.leadersystems.com.au/products.html?0PMmc8/ne/o=IlxX4FvwTCsdSQZNk4qLVw==w8qsEV1V1BwI30vk8Y1tnq7nSSw=',
  'NWG-WGCSM061': 'https://partner.leadersystems.com.au/products.html?KwQNvtbYowE=jui1QnxRDRsCm11CGuhSaw==OKWz/3VBbMDDlbXs52N7SqC/3jY=',
  'NWG-WGCSM063': 'https://partner.leadersystems.com.au/products.html?Z7bKdTaAioo=Z5qeN/SCHYz6Hl1mgOpNHA==YheKDyXQPCsbuluziLL7oWoZsfc=',
  'NWG-WGCSM101': 'https://partner.leadersystems.com.au/products.html?3G0tifncQEw=djvWhiINLoPuQhJW7tPGeQ==adtt/tZzUZ9dc42+/x7DzWbaPkg=',
  'NWG-WGCSM121': 'https://partner.leadersystems.com.au/products.html?KH90DNL3DN0=avPXoYFnOxL8MNiWWO8+GQ==UUOYXk1UEKHPjbxtuEWtmRw98bs=',
  'NWG-WGCSM131': 'https://partner.leadersystems.com.au/products.html?jaSqQOxl3Hg=kqhTCCkXaPbOIzRFDM3IMw==LfyrRpc7VbKkfrBMpXbCikSS544=',
  'NWG-WGCSM141': 'https://partner.leadersystems.com.au/products.html?oHV5Oh/cN4I=WJn6NJztVpVxxHwNG2nWbQ==oGZCITjuQTuJ+O1nUK81C1kU610=',
  'NWG-WGCSM151': 'https://partner.leadersystems.com.au/products.html?aCNF7Ohn/ig=GAtu/OztAV3SJv2D6uFm8Q==mdq1jiTvdXQSnoLAEfQccBsuFSc=',
  'NWG-WGCSM171': 'https://partner.leadersystems.com.au/products.html?BrSire/zZHo=BSbv1MdXOLVuU8CmCpZn9A==gwpBa/5wTK4oYLKx4LBtEZ2L9l4=',
  'NWG-WGCSM173': 'https://partner.leadersystems.com.au/products.html?aXAb4HKuto8=L/I3deUlxPmhLWOgEFKU1g==bB8qyT7crvonBCPsrBBsRxjPPfw=',
  'NWG-WGCSM201': 'https://partner.leadersystems.com.au/products.html?o1Zoe+V6Q2Y=MYi7sUNW/H9JdoQVT89O3w==qfXaIKV6V+mW0AuvADBxVeTLzlU=',
  'NWG-WGCSM203': 'https://partner.leadersystems.com.au/products.html?fHOlySI0wiU=gw2w8AQiwx69Z8p72k4EKw==SSwM3t+CTQ5tnD9MqJDYCHv/FqA=',
  'NWG-WGCSM261': 'https://partner.leadersystems.com.au/products.html?5aEgst7gyts=/Q4o8X5ZViuVq5LlT2AOEA==3i9PA59ZvOPgpmpM4mUwtOAVJqM=',
  'NWG-WGCSM263': 'https://partner.leadersystems.com.au/products.html?BYmzvaq9DNk=7fKNRjtdz9c3oRMWUrCvZw==TTZcRfNC5Eq62nmc/HD+cmRFbrs=',
  'NWG-WGCSM331': 'https://partner.leadersystems.com.au/products.html?zBJ83uWjBpI=0+sEIFFFugsj78D8KvLgAg==0dWDy93FRtj7kJq3mIPHqdF/bFc=',
  'NWG-WGCSM333': 'https://partner.leadersystems.com.au/products.html?DcNE0DJPkKo=eWiTgxd5J6rQixXLvofhEA==rkRkEcySyfPbiX/+T5nn562CPcU=',
  'NWG-WGCSM351': 'https://partner.leadersystems.com.au/products.html?tBWQXJGBw6c=8cMnyrRIEyiko2PnfhFPQA==gTX03zJulqcWdrAbcgLT6mxjAEQ=',
  'NWG-WGCSM353': 'https://partner.leadersystems.com.au/products.html?/j3uemcp/Ao=vmQcBTmVblQcac/WPZuR+A==WMAYXmcx5QSnNWWxKKZBQ3CNmy8=',
  'NWG-WGCSM521': 'https://partner.leadersystems.com.au/products.html?yEAG116tkVE=WecEa0P/KYaS/s+VXdw7DA==N2kmXUQUciS7XjLL2UrWhflG8L0=',
  'NWG-WGCSM523': 'https://partner.leadersystems.com.au/products.html?xLbV0tiPZzY=Y7RUGDK6dLWrlTLTRhwqVw==CsnTPIoFgw6s9vJ9reN2bAeV6eY=',
  'NWG-WGCSM641': 'https://partner.leadersystems.com.au/products.html?RTCH9+8OeQ4=JpSb00NYE/qtUq1vd88rhA==QWu5vR1bzRAwgkjCllOs+S9cHAM=',
  'NWG-WGCSM643': 'https://partner.leadersystems.com.au/products.html?Qj+ZzpoSkr8=xhdzAUGA0r1tfdgCNG80sw==MMYtEfJXcmPSRZtFeZvlCEaA71U=',
  'NWG-WGCSM671': 'https://partner.leadersystems.com.au/products.html?R9x+bFhsSfI=SFUGwMdjtTvwvfqCdnq58A==fhU1b0GbOhvrWNHbWrYtMZIXVJI=',
  'NWG-WGCSM673': 'https://partner.leadersystems.com.au/products.html?vipjcuOWBI8=Rig+Fw93OhG57CFUuRiFkA==n3VfQ4I9unJWf48q2rr3r2sAIj8=',
  'NWG-WGCXL001': 'https://partner.leadersystems.com.au/products.html?tfQLJwnybqE=TfcGBwV8AFgguBgh+g+AzQ==YFwFJDnUURPx/P7W0jLgi+DKXD4=',
  'NWG-WGCXL003': 'https://partner.leadersystems.com.au/products.html?PtYKFKPKvJM=RdD2xYuWaSglBCN1SAhhoQ==90iAvMI68qoR24DH8+oskUK5kkQ=',
  'NWG-WGCXL031': 'https://partner.leadersystems.com.au/products.html?sWyaTmwcB7s=uEeExYP8o2TUI8cyIVEeng==ZvGhJE2eSjd+VnzZ7sjFzt7cYE8=',
  'NWG-WGCXL033': 'https://partner.leadersystems.com.au/products.html?0xTGPQaj+MA=NIxB2utTTBTsb7kxDuqm8A==t89YIko4qs2bB3cAV5VwtGpc/Jg=',
  'NWG-WGCXL061': 'https://partner.leadersystems.com.au/products.html?L9tV78v54/U=D83dz9YDdoHjbzM1b0a01g==6FNXVRY/UMwP4wYI7JjxOtXCDTM=',
  'NWG-WGCXL063': 'https://partner.leadersystems.com.au/products.html?E6JTYpfZZuk=k39qLj02llZmR7c5XN/wwQ==Ztwk3wVpAO2npqrFbrg6oY4aOYE=',
  'NWG-WGCXL101': 'https://partner.leadersystems.com.au/products.html?GYp4Uxz25CM=L123z5WbrSbNOeTwrIOrxw==LWiL50VH1rzBIHHLZwroQmR2fv0=',
  'NWG-WGCXL121': 'https://partner.leadersystems.com.au/products.html?4S58uPLuR8I=T0NmZi3x3U9Wq9Y+geu1Rg==4g8nf1yyeq+SI32aLnYqaUkmGe8=',
  'NWG-WGCXL131': 'https://partner.leadersystems.com.au/products.html?oXUWvJLxhVg=3fNsVdwTUaKUkM4nXKDl8Q==58dvJlpXn9BZvKT99KptfsZT1ac=',
  'NWG-WGCXL141': 'https://partner.leadersystems.com.au/products.html?B1dyo8b4i8E=wTiEmjFVCbiugtVhYYoXCQ==4y/AjYNslbvDXEvYodAVpDSgN20=',
  'NWG-WGCXL151': 'https://partner.leadersystems.com.au/products.html?0SqxxJUFHs4=i7vRzXPNGk3ToYeHpAo98w==ycUI0mHcHeVNC8C55VidQ+/ONOk=',
  'NWG-WGCXL171': 'https://partner.leadersystems.com.au/products.html?MREAJTLJ9lU=gQTJLiHFeyIX83jJgyMniQ==D3o6oxVqjAP3kdFdN6/Lh1KQ4wo=',
  'NWG-WGCXL173': 'https://partner.leadersystems.com.au/products.html?HOhlNcDCPKc=v5VCsD8JXHXMuQCyIKdX8w==6XMqvw8lWhtaD7xwwidcBie1+uw=',
  'NWG-WGCXL201': 'https://partner.leadersystems.com.au/products.html?FV3btioKxTU=r58GSqfuwl6CpZhRhdcxog==7Uc7Sn1O3b1u2S7W8CbIARvPP+8=',
  'NWG-WGCXL203': 'https://partner.leadersystems.com.au/products.html?QQtS1CfKR28=ZHzoMtCCwmtGMsXqBQEHRg==Ci/mHQ+mtxtFssaNOS2JiHC4m2Y=',
  'NWG-WGCXL261': 'https://partner.leadersystems.com.au/products.html?VuOna+0crko=P9bDex4/TxVLuVOkgwy5NQ==n1mE9JT+yEPt2CwvBBpR1SVhsYI=',
  'NWG-WGCXL263': 'https://partner.leadersystems.com.au/products.html?qBUszQQWySc=J9vaHz3O5b0p7dbp8oIP+A==pP5/Db6qrhbQr+PZTeQ0+IuO2sQ=',
  'NWG-WGCXL331': 'https://partner.leadersystems.com.au/products.html?hGWntN9Tb4U=if9UZQ5iFzIsrVeXDgaPDw==xANXk0HHsT2qwvAB++WCnembcQQ=',
  'NWG-WGCXL333': 'https://partner.leadersystems.com.au/products.html?/WXYK203M8A=RysguqcC6FUlwYyAzH+f2g==T1bIa4inULvLUrc4boelQONwW68=',
  'NWG-WGCXL351': 'https://partner.leadersystems.com.au/products.html?jGgGXzceOBE=d/aDiXoxUwNvobRahw7x/w==sN3oE2qFizUQgK5HtO/Ud6Rl8ug=',
  'NWG-WGCXL353': 'https://partner.leadersystems.com.au/products.html?8gNBbRuj9JU=BL02lOk2ufia3WnsdxrvZw==U5VJ3eH107Sw4e81g77UynJq4Os=',
  'NWG-WGCXL521': 'https://partner.leadersystems.com.au/products.html?aXt/PuHlVlA=jUzfykcdRFqWF5TogSucCA==RcLcz7g+JYc/4yA78FpVPfe6sf0=',
  'NWG-WGCXL523': 'https://partner.leadersystems.com.au/products.html?J+Az02tqaQk=80h9H2W/jbT2CTsheNJIGw==hrxp60eNOvnNvVG95CkUlwXVoJI=',
  'NWG-WGCXL641': 'https://partner.leadersystems.com.au/products.html?aQfLuAOnsrA=elzHew6MGLhlMt5EISG1ug==kWvuikCWVYkysoTUzl+6+HwnZYk=',
  'NWG-WGCXL643': 'https://partner.leadersystems.com.au/products.html?fycYb5BVaIM=DFT54cnR5hDwxAVBzPKFig==iqN9IkdH/7bNn8ulhqyi7JVFDjc=',
  'NWG-WGCXL671': 'https://partner.leadersystems.com.au/products.html?ey94xLVvyTc=6qtZYRxInHWCj79tKfG0aw==xrh6Vqj6QolLTHgUvQUpl49hAvE=',
  'NWG-WGCXL673': 'https://partner.leadersystems.com.au/products.html?9p8h/EZIsjM=B3MJM4pb51V42nvBkpxPGQ==280/iiXmB1bS3Bba6LkXN1ho1n0=',
};

// Spec slug mapping (model key → featureSpecs key)
const SPEC_SLUGS = {
  'Firebox Cloud Small': 'FireboxCloud-Small',
  'Firebox Cloud Medium': 'FireboxCloud-Medium',
  'Firebox Cloud Large': 'FireboxCloud-Large',
  'Firebox Cloud XLarge': 'FireboxCloud-XLarge',
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
  { id: 'cloud', label: 'Cloud Retention', Icon: Cloud },
  { id: 'tradeup', label: 'Trade-Up', Icon: TrendUp },
  { id: 'individual', label: 'Individual Subs', Icon: ListChecks },
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
                  <span className={styles.cardModelLabel}>Firebox Cloud {model.label}</span>
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
                        name: `Firebox Cloud ${model.label}`,
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
   ═══════════════════════════════════════════════════════════ */
function RenewalConfigurator({ id, title, description, sectionId, options, data, onAdd, suiteLabel = 'Security Suite', termLabel = 'Select Term' }) {
  const { MODELS, selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const modelSel = selections[selectedModel]?.[sectionId] || {};
  const activeServiceType = modelSel.serviceType || options[0]?.key;
  const availableTerms = getAvailableTerms(selectedModel, activeServiceType);
  const activeTerm = modelSel.term || availableTerms[0];
  const sku = getSkuForSelection(selectedModel, activeServiceType, activeTerm);
  const price = getPriceForSelection(selectedModel, activeServiceType, activeTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  return (
    <section id={id} className={styles.renewalSection}>
      <div className={styles.renewalHeader}>
        <h2 className={styles.renewalTitle}>{title}</h2>
        <p className={styles.renewalDesc}>{description}</p>
      </div>
      <div className={styles.renewalBody}>
        <div className={styles.renewalConfigSide}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Firebox Cloud Model</label>
            <select
              className={styles.renewalSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.key} value={m.key}>Firebox Cloud {m.label}</option>
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
                name: `Firebox Cloud ${MODELS.find((m) => m.key === selectedModel)?.label}`,
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
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`${activeServiceType} — Firebox Cloud ${MODELS.find((m) => m.key === selectedModel)?.label}`}
              className={styles.renewalImage}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Individual subscriptions — card grid per subscription
   ═══════════════════════════════════════════════════════════ */
const SUB_DESCRIPTIONS = {
  'WebBlocker': 'URL/content filtering to block access to malicious and inappropriate websites',
  'Gateway AntiVirus': 'Signature-based antivirus scanning at the gateway to catch known threats',
  'Intrusion Prevention Service': 'Network-based IPS to detect and block exploit attempts in real time',
  'Reputation Enabled Defense': 'Cloud-based reputation lookup to block traffic from known bad sources',
  'Application Control': 'Granular control over 1,800+ applications to enforce usage policies',
  'APT Blocker': 'Full-system sandbox analysis to identify advanced zero-day malware',
};

function IndividualSubCard({ sub, data, onAdd }) {
  const { MODELS, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const terms = getAvailableTerms(selectedModel, sub.key);
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || '1 Year');

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
    <div id={`cloud-sub-card-${sub.key}`} className={styles.indCard}>
      {imageUrl && (
        <div className={styles.indCardImageWrap}>
          <img src={imageUrl} alt={sub.label} className={styles.indCardImage} />
        </div>
      )}
      <div className={styles.indCardBody}>
        <h3 className={styles.indCardName}>{sub.label}</h3>
        <p className={styles.indCardDesc}>{SUB_DESCRIPTIONS[sub.key] || ''}</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Firebox Cloud Model</label>
          <select
            className={styles.renewalSelect}
            value={selectedModel}
            onChange={handleModelChange}
          >
            {MODELS.map((m) => (
              <option key={m.key} value={m.key}>Firebox Cloud {m.label}</option>
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
              name: `Firebox Cloud ${MODELS.find((m) => m.key === selectedModel)?.label}`,
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
    const el = document.getElementById(`cloud-sub-card-${key}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id={id} className={styles.indSection}>
      <div className={styles.indSectionHeader}>
        <h2 className={styles.renewalTitle}>Individual Subscriptions</h2>
        <p className={styles.renewalDesc}>Add individual security services a la carte</p>
      </div>
      <CloudBannerCarousel onScrollTo={handleScrollToSub} />
      <div className={styles.indGrid}>
        {subs.map((sub) => (
          <IndividualSubCard key={sub.key} sub={sub} data={data} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main CloudCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function CloudCatalog() {
  const data = useFireboxCloudData();
  const { MODELS, SECTIONS, selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const { addItem } = useQuote();
  const scrollRef = useRef(null);

  const [specsOpen, setSpecsOpen] = useState(true);

  useDragScroll(scrollRef);

  const specSections = SECTION_DEFS.fireboxCloud || [];
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
        <h1>Firebox Cloud</h1>
        <p className={styles.intro}>
          WatchGuard Firebox Cloud delivers enterprise-grade network security purpose-built for
          public cloud environments. Deploy in AWS or Microsoft Azure with the same comprehensive
          security services available on physical and virtual Firebox appliances.
        </p>
      </div>

      {/* ═══ COMPARISON GRID ═══ */}
      <div className={styles.tableWrapper} ref={scrollRef}>
        <div className={styles.grid} style={{ gridTemplateColumns: gridCols }}>
          {/* ── Product Header Row ── */}
          <div className={styles.headerLabel} />
          {MODELS.map((model) => (
            <div key={model.key} className={styles.productCard}>
              <div className={styles.productName}>Firebox Cloud {model.label}</div>
              <div className={styles.productDesc}>{model.description}</div>
            </div>
          ))}

          {/* ── New Purchase Options ── */}
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
                      name: `Firebox Cloud ${model.label}`,
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
                    <div key={`sec-hdr-${sIdx}-${model.key}`} className={styles.sectionHeader} />
                  ))}

                  {section.rows.map((row) => (
                    <React.Fragment key={row.key}>
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

      {/* ═══ INDIVIDUAL SUBSCRIPTIONS ═══ */}
      <IndividualSubsSection id="individual" data={data} onAdd={handleAdd} />

      {/* ═══ INFO SECTIONS ═══ */}
      <div className={styles.infoSection} id="security-suites">
        <SecuritySuiteTable />

        <div className={styles.infoBlock}>
          <h3>About WatchGuard Firebox Cloud</h3>
          <p>
            Firebox Cloud extends WatchGuard's enterprise-grade network security into public cloud
            environments. Purpose-built for AWS and Microsoft Azure, it provides the same
            comprehensive security services — including stateful firewalling, intrusion prevention,
            application control, and advanced threat detection — that protect physical and virtual networks.
          </p>
          <h3>Supported Cloud Platforms</h3>
          <ul className={styles.hypervisorList}>
            <li>Amazon Web Services (AWS)</li>
            <li>Microsoft Azure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
