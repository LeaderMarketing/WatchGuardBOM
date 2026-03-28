import React, { useState } from 'react';
import {
  ShoppingCartSimple,
  ShieldCheckered,
  Eye,
  CaretLeft,
  CaretRight,
  CheckCircle,
  XCircle,
  Lightning,
  Brain,
  Target,
  Pulse,
  ShieldStar,
  Handshake,
  ChartLineUp,
  Clock,
  Headset,
  WarningOctagon,
  Bug,
  Shuffle,
  CloudArrowUp,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import styles from './MdrNdrCatalog.module.css';
import { useMdrNdrData } from './hooks/useMdrNdrData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';

const BASE_URL = import.meta.env.BASE_URL;

// SKU → URL mapping (Leader partner portal links)
const SKU_URLS = {
  // ─── Core MDR ───
  'NWG-WGMDR30101': 'https://partner.leadersystems.com.au/products.html?K/qTqJ2mGpo=QE6Pon8Gjhf6804H/S4tNw==PCNtYGHdExcYTRTicz9QxytPetYQPQ==',
  'NWG-WGMDR30103': 'https://partner.leadersystems.com.au/products.html?OWtMgirxJlM=5raaUL6pXzk0+MSjKCMBuw==94CWXixBUlL226vaP0is8tH9MhYAew==',
  'NWG-WGMDR30201': 'https://partner.leadersystems.com.au/products.html?VC+HI2UDI6k=FI9qFwtHoanVHGl4W2YvVQ==VwcHvCNc5XppkCCjwwbx9IZWF+tjpA==',
  'NWG-WGMDR30203': 'https://partner.leadersystems.com.au/products.html?7nraqjwThUQ=UmGtVXtzgACswJ9RIjEA4Q==u331Jkf++kUK0NsWM5jI57Uz+U+S+g==',
  'NWG-WGMDR30301': 'https://partner.leadersystems.com.au/products.html?Zqbuo5MBP9k=3aa9j86JfPg7EJA/0H3htA==Yiy/SOaICv6tVQtbdi3lhj6LdOsiUw==',
  'NWG-WGMDR30303': 'https://partner.leadersystems.com.au/products.html?C/trlfvRJo4=pVd/n49iuGXqHdiZJjCbNA==b9ijJaK3a/cWEdEtVqccwZtIPlQN7g==',
  'NWG-WGMDR30401': 'https://partner.leadersystems.com.au/products.html?sLOBVhUuA1M=3+jpCsFionDaqm5xy33vvA==HwaZzkKIBXWn7QxtkBxFb6K2i4fnFg==',
  'NWG-WGMDR30403': 'https://partner.leadersystems.com.au/products.html?oVXY7FwIBqg=W8z8Ye514tBbT+Xo7SId4g==LQrWjFqVcRT+7EUKizXlh1TrfEUUFw==',
  'NWG-WGMDR30501': 'https://partner.leadersystems.com.au/products.html?pu7Idig98fE=VTcHvmdZ7sLkf8JlUOxLPA==aeWH9tvWwqJ+sbJplehkfU0YsRcmtQ==',
  'NWG-WGMDR30503': 'https://partner.leadersystems.com.au/products.html?p0B0sogxcNI=l2yunFq06havAfCUCOM04w==Pznk4FGaox0Mgz3qaT4BTRRyEZF5LA==',
  'NWG-WGMDR30601': 'https://partner.leadersystems.com.au/products.html?f6NDhB9n7lE=ykrm3OwwZMSAxOvXFeOXNg==MfZibBglkNptKcB8LtJr5Fk7gFmf6A==',
  'NWG-WGMDR30603': 'https://partner.leadersystems.com.au/products.html?7EUchDqC70Q=NXDNdD48pdmhqyTOYIJdZg==x2MYBLYJNAsZPPcBRN2MAYE56KYARA==',
  'NWG-WGMDR30701': 'https://partner.leadersystems.com.au/products.html?SsTaLAWhH7Y=4h540kNcU0CY0DCWjiZd4Q==Q71kTk9EOBHN11MX40UkQBH0kN1zMA==',
  'NWG-WGMDR30703': 'https://partner.leadersystems.com.au/products.html?aZwNL8FSRb8=B1Emj3klJVKb0Sf8x87Yzw==5YmdUjY2meD8+i7AY4MK5agLtgAKGA==',
  // ─── Core MDR for Microsoft ───
  'NWG-WGMDRM30101': 'https://partner.leadersystems.com.au/products.html?EuL3LAkFaQU=54iXHvl1yOlXAC02QzC/Ug==tuBU1z8V0qpc7vrM7x4FwZCAVAEXZxE=',
  'NWG-WGMDRM30103': 'https://partner.leadersystems.com.au/products.html?KomrS3VAIYA=xct5BsXFfNvOe0gpBYHXtQ==8aEzt4jx1Pmf9iWrfA/j32G+wXb9Il0=',
  'NWG-WGMDRM30201': 'https://partner.leadersystems.com.au/products.html?JZeRzc0ciQY=M5WMY7TD4ZmvGyD+szSqbg==FMmP4tp4BLWOIpA8biv1S3F9Kyfxv3k=',
  'NWG-WGMDRM30203': 'https://partner.leadersystems.com.au/products.html?UqRABxYE2ko=DFvlgQqiJzFF9tRaqfD6Pw==u3CUiMnvsn+dourmLTAcmHSXP7S6D5k=',
  'NWG-WGMDRM30301': 'https://partner.leadersystems.com.au/products.html?HeTGipgRJmw=G4dxmdiZytG/lKv45q8ZZQ==BOK8dLQ/ZHhiG2yINGH57TEfxTYU/jI=',
  'NWG-WGMDRM30303': 'https://partner.leadersystems.com.au/products.html?qWAgsI+wX1A=+CozZ6zQDJ9uR41N96m2ng==JZzf1y6tEjpT1G619Q56klL7ErecbdM=',
  'NWG-WGMDRM30401': 'https://partner.leadersystems.com.au/products.html?XQ34c4r40Tw=3kQPzZUYp0HvqRdd6UWxzw==797Cg3Ogdr02cCJ3qO1y3JR3cfblCrg=',
  'NWG-WGMDRM30403': 'https://partner.leadersystems.com.au/products.html?wEv9k2pPCpU=4xwCyLVXSooOd1d0AAJ+xw==oCJ7MG5ITs6i/xwMtKDD3Y+6f6GCleY=',
  'NWG-WGMDRM30501': 'https://partner.leadersystems.com.au/products.html?knqj76U34WM=82peJ6cF3jUIRgH1iL9RPg==p0zk+zVGox+8LLLnRIaoJRtTtnFAMho=',
  'NWG-WGMDRM30503': 'https://partner.leadersystems.com.au/products.html?t+2lOd4TaEo=RFRlbrLkbjnMtRhj88V0cw==Mte1826c/bwzQPTp6Tc7Vyn6vKukUDk=',
  'NWG-WGMDRM30601': 'https://partner.leadersystems.com.au/products.html?cAB7jP7gq4E=DGxULUr7xTOp/+tBy9Is/w==HlZwfMAqVvlaYUO3uI3AJUTgvm5RIBE=',
  'NWG-WGMDRM30603': 'https://partner.leadersystems.com.au/products.html?tYI4dag9ek8=rtIOFuIuLSHi9fcR2oCpnw==sF1NHwzV8KCDHM8hFhyo40CLQ/wpgPc=',
  'NWG-WGMDRM30701': 'https://partner.leadersystems.com.au/products.html?wGuWqqyKw3Y=KnxPzz5uSYgZmO7Z17iAVw==LwXl/e3xWtvfCtqlHiHeFLuuSc6Zd8U=',
  'NWG-WGMDRM30703': 'https://partner.leadersystems.com.au/products.html?9zDbVQy2eQc=3jQ2iwMs2BH+iX4ns2hqZw==0TCVSM3IR+yHuWAULIo0RqovjR70GNs=',
  // ─── Total MDR ───
  'NWG-WGMDRT30101': 'https://partner.leadersystems.com.au/products.html?4XghZCdE7gY=NmVe5KzxXpBiqG+iWPIimA==65A7aqWQkRr8v7ctRmaB+hsMTV3/djw=',
  'NWG-WGMDRT30103': 'https://partner.leadersystems.com.au/products.html?9fqgS59yAhk=5qiiV4k/4Wr9QKlbkmwwnA==+mzhHbCheaXzd37PuZSjCAJciELEvTM=',
  'NWG-WGMDRT30201': 'https://partner.leadersystems.com.au/products.html?fY12qLZiB4E=AJWnHRaXFsxocGSL6lasXw==c3bf+XX2W/QsWWbe+rdIcQBHnCqdIiQ=',
  'NWG-WGMDRT30203': 'https://partner.leadersystems.com.au/products.html?kZLUQyTqd7I=lWjHi8JwWUjhbRnfY78a7w==EiH0AmbfuII3oHjDrBUMv65CDi1h8ek=',
  'NWG-WGMDRT30301': 'https://partner.leadersystems.com.au/products.html?wfdnPdimBZ0=4W9OJbMxLtXOtFYbdoxFxQ==egvyZVoT4Z2kXK515F31Nx3kUD5w490=',
  'NWG-WGMDRT30303': 'https://partner.leadersystems.com.au/products.html?tWqrDjzV+vE=4CyM6bFiwWUIJb/+rp0clQ==xiHlLglTvLdMLER9xIUSQieJOkz9Ejo=',
  'NWG-WGMDRT30401': 'https://partner.leadersystems.com.au/products.html?kTWXXOeXP+0=95py8ZZjtJcVbvN35tJ7fg==o+fgvDmB2r+98dx7HEe0RsFHlj6Lmjo=',
  'NWG-WGMDRT30403': 'https://partner.leadersystems.com.au/products.html?Y2hpMi9UDRE=FP6aZyJfN98buN7/4q3dXA==rUGp9vUR1zcgsyx5DcmPmtZuu5cBe1A=',
  'NWG-WGMDRT30501': 'https://partner.leadersystems.com.au/products.html?md14YNyWBiw=FFbNM38Hrdcb1CXTW2s4ug==07ooO0tHfJYuUchhrpSY4n6to5pOa8w=',
  'NWG-WGMDRT30503': 'https://partner.leadersystems.com.au/products.html?4LvgQkaZ25Y=ubhq7kkhlyDfoIq30ZHuVg==QiKMNV7mTKEewuANcwKrmWaIJdNNo6A=',
  'NWG-WGMDRT30601': 'https://partner.leadersystems.com.au/products.html?uWvY8lk75bg=WSxDAId5dYBBZcUBeArHjw==qgQpQMGclZKGXLCLwME59gJFvq73TcU=',
  'NWG-WGMDRT30603': 'https://partner.leadersystems.com.au/products.html?6dYvvEx4a2Q=o2i8tabJh8Tl8uakroAceA==w/ZdI5gcVdDqQ4T4EmPmr1FJA7bPvJo=',
  'NWG-WGMDRT30701': 'https://partner.leadersystems.com.au/products.html?PTzBcCC+gEk=hNZpRdqb4dVUSupcNxVPgQ==Sk5UDAEfPIcCi11oQDz64Tuw+PYITVA=',
  'NWG-WGMDRT30703': 'https://partner.leadersystems.com.au/products.html?suW1tvDelk4=fXiRtMuE/Pv/kERYjJesiQ==UEusUp3HFl9H99XjOsoRrx8vIvF33h8=',
  // ─── ThreatSync+ NDR ───
  'NWG-WGTSNDR30101': 'https://partner.leadersystems.com.au/products.html?VeL0UaxPpfU=PmTE4vEa+le+JxhEhc9S9Q==eU1ILhFsK6P07QMkP0//N3Z0ghtecHK4',
  'NWG-WGTSNDR30103': 'https://partner.leadersystems.com.au/products.html?wLAKT+KKr2Q=KleoO2jxv9nzn013TahkCw==11KScbgRaWKCAO/6Fdw2y/yJeU7LqU9U',
  'NWG-WGTSNDR30201': 'https://partner.leadersystems.com.au/products.html?zx0Dso+Rs2E=jt8AnQwkIQIpChyBzzPSlg==6SM3M5VxE8JAdrpg4Dpf9k3sCr82ajS5',
  'NWG-WGTSNDR30203': 'https://partner.leadersystems.com.au/products.html?NJp8BxhFUOg=oIP4zanyLsWyBNdNFDQYvw==2g1IHu8amAGo6uEKa4YvE27jyFhbIJTZ',
  'NWG-WGTSNDR30301': 'https://partner.leadersystems.com.au/products.html?G/+g6Ea68pw=tNAmA6lzhq9zbsUTTIJXJw==NixV+PR8QkEcWYS5DAab5Lwkasx2LUiV',
  'NWG-WGTSNDR30303': 'https://partner.leadersystems.com.au/products.html?OxeNLXbhMUw=Dy7zqC3zQfh4ytCOMLmXKg==ClQ9vL6C1xdStqoJE+u7TovfdWKHqpk7',
  'NWG-WGTSNDR30401': 'https://partner.leadersystems.com.au/products.html?5vFh9cZD+Wo=25YZbppAdDYakFka3AljzQ==Dvv5Q5I8EOn4VfoB2Lps0Z8jRVvWqN7O',
  'NWG-WGTSNDR30403': 'https://partner.leadersystems.com.au/products.html?4pFFwm4rSHU=WbNf+/goSUbrHy1FGg4I5g==KaAAvXxqpXVsrpsRPRLTAJxaqxdu2lNK',
  // ─── Total NDR (ThreatSync+ SOC) ───
  'NWG-WGTSST30101': 'https://partner.leadersystems.com.au/products.html?f83r4bhQv/o=VJNl60zrRnhw5AIwLkTzZQ==Ad2HHYydxMmDibW2k9O3NpzEpBnedMQ=',
  'NWG-WGTSST30103': 'https://partner.leadersystems.com.au/products.html?gqVr2BEscYU=9P1BnoBfS9WgGM+Y2O4YaQ==Oe2nk1pHc2yuNQPCA+XYXKoIbKjlnrA=',
  'NWG-WGTSST30201': 'https://partner.leadersystems.com.au/products.html?SZI74qvtJ+g=k6AYAPyVaIM6iWJnUzfB+g==c2yLAr8vEeWzbie5TVetEZLOOuUgUqE=',
  'NWG-WGTSST30203': 'https://partner.leadersystems.com.au/products.html?GXqjmS5/Oqc=BcsBlI4HnsPLzK+hKuJC8g==14S1Lr2/2DgozHHYvUvfs0fBxRM/RPU=',
  'NWG-WGTSST30301': 'https://partner.leadersystems.com.au/products.html?55sBS3wD/1w=kRfBHqSIgSCCpUZzY85jBw==XnVj0fbdaQcGRjzj0knPVBaaY00rEQ0=',
  'NWG-WGTSST30303': 'https://partner.leadersystems.com.au/products.html?lR7MNST6lIY=gKV0+duaTwegTekVQyjl7Q==YqJIX7B8YjuCKJQkO0Q0Xcg5CDNN+Yg=',
  'NWG-WGTSST30401': 'https://partner.leadersystems.com.au/products.html?31ZLEdTyFpE=QcGmVGzFr7fWHWipBqFQHQ==FWFZoX4Vp/Hc3tmTLIcq0y2QriJ3nM4=',
  'NWG-WGTSST30403': 'https://partner.leadersystems.com.au/products.html?0MVT1GL8DRY=cNgVw4qcP4tyIXmfmv51Qg==2YlGtA4ellumKMShz0dTv1NUwzdlQe8=',
  // ─── ThreatSync+ SaaS ───
  'NWG-WGTSSAAS30101': 'https://partner.leadersystems.com.au/products.html?Yoi684YLMSk=HWyXumxPWs0RgWJoxDt+ow==tsPEygWivx2720AV78L+HSg9sUzFdBp/7w==',
  'NWG-WGTSSAAS30103': 'https://partner.leadersystems.com.au/products.html?vT2mGXvAWWM=Fr1snOMyac9+rB0BSElz/Q==aBrH7eAcUsoGpeAWYcKA/xaJPlZi1TQGYQ==',
  'NWG-WGTSSAAS30201': 'https://partner.leadersystems.com.au/products.html?vpkyp/mXtOk=yh36r5xHHabdN4Mz2vntew==9EHj/FMwClHzewu4xItD+PrjfqVbgfWljA==',
  'NWG-WGTSSAAS30203': 'https://partner.leadersystems.com.au/products.html?G6HzxyLiP3c=TMa+jSw/JA7Abq7CMtadbA==H3UxsITSs3/m4oWsTknRDJ98F6CJcttG8Q==',
  'NWG-WGTSSAAS30301': 'https://partner.leadersystems.com.au/products.html?yGDrn+r5yuQ=yLe9qaxMs1Sy4c7CxA4cfA==vzERbh+2A1Yw3xCDaEAU7bYfVybfwOcASQ==',
  'NWG-WGTSSAAS30303': 'https://partner.leadersystems.com.au/products.html?kDX4FhtHsMo=Q8jCoy6gO7OxopUfRERUZA==SfA0Wt3Yxn0x4JPwkfqueOKxBEkXza5K5Q==',
  'NWG-WGTSSAAS30401': 'https://partner.leadersystems.com.au/products.html?+HE81DBnlnU=232WxWtBbEgZDLTFizQ3Dw==mU9W9/PXRQjW+Ac5n0WZl7v+GoC/TfMNXQ==',
  'NWG-WGTSSAAS30403': 'https://partner.leadersystems.com.au/products.html?vVDt9icycrw=1TyvBdRhcraMahLSn+51Uw==XiQ182Q+WYN+8nhLXDsS3eetBp1dYkENHA==',
};

function getSkuUrl(sku) {
  return SKU_URLS[sku] || '';
}

/* ─── Tab definitions ─── */
const TAB_ORDER = ['mdr', 'ndr'];
const TAB_LABELS = {
  mdr: 'Managed Detection & Response',
  ndr: 'Network Detection & Response',
};
const TAB_ICONS = {
  mdr: ShieldCheckered,
  ndr: Eye,
};

const BANNERS = {
  mdr: `${BASE_URL}banners/mdr_banner.jpg`,
  ndr: `${BASE_URL}banners/ndr_banner.jpg`,
};

/* ─── Tab content config ─── */
const TAB_CONTENT = {
  mdr: {
    headline: '24/7 Threat Detection and Response Across Your Security Stack',
    description:
      'WatchGuard MDR is a fully managed 24/7 service that doesn\'t just alert you to threats – we act on them. Cutting through the noise, our team helps you focus on what matters, and respond fast to threats across your laptops, servers, user identities, network, and cloud.',
  },
  ndr: {
    headline: 'AI-Powered Network Visibility and Threat Detection',
    description:
      'WatchGuard ThreatSync+ NDR uses AI-driven analysis to detect threats hiding in network traffic that endpoint solutions alone might miss. Gain deep visibility across your entire network, detect lateral movement, and respond to threats automatically.',
  },
};

/* ─── Reusable SKU display ─── */
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

/* ═══════════════════════════════════════════════════════════
   Product Card — one per product line
   ═══════════════════════════════════════════════════════════ */
function ProductCard({ product, data, onAdd }) {
  const { selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection } = data;
  const sel = selections[product.key] || {};
  const tier = sel.tier || product.tiers[0];
  const terms = getAvailableTerms(product.key, tier);
  const term = sel.term || terms[0];
  const sku = getSkuForSelection(product.key, tier, term);
  const price = getPriceForSelection(product.key, tier, term);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  const handleTierChange = (e) => {
    const newTier = e.target.value;
    setSelection(product.key, 'tier', newTier);
    const newTerms = getAvailableTerms(product.key, newTier);
    if (newTerms.length && !newTerms.includes(sel.term)) {
      setSelection(product.key, 'term', newTerms[0]);
    }
  };

  return (
    <div className={styles.productCard}>
      {imageUrl && (
        <div className={styles.cardImageWrap}>
          <img src={imageUrl} alt={product.label} className={styles.cardImage} />
        </div>
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{product.label}</h3>
        <p className={styles.cardDesc}>{product.description}</p>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>License Tier</label>
          <select
            className={styles.selectField}
            value={tier}
            onChange={handleTierChange}
          >
            {product.tiers.map((t) => (
              <option key={t} value={t}>{t} licenses</option>
            ))}
          </select>
        </div>

        {terms.length > 0 && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subscription Term</label>
            <select
              className={styles.selectField}
              value={term}
              onChange={(e) => setSelection(product.key, 'term', e.target.value)}
            >
              {terms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.priceBlock}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price)}</span>
            <span className={styles.priceNote}>MSRP <span className={styles.perSeat}>per seat</span></span>
          </div>
        </div>

        <button
          className={styles.addBtn}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: product.label,
              description: `${tier} licenses (${term})`,
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

/* ═══════════════════════════════════════════════════════════
   Banner with navigation arrows
   ═══════════════════════════════════════════════════════════ */
function MdrNdrBanner({ activeTab, setActiveTab }) {
  const [imgFailed, setImgFailed] = useState({});
  const content = TAB_CONTENT[activeTab];

  return (
    <div className={styles.bannerWrap}>
      {imgFailed[activeTab] ? (
        <div className={`${styles.bannerFallback} ${activeTab === 'mdr' ? styles.bannerFallbackMdr : styles.bannerFallbackNdr}`} />
      ) : (
        <img
          src={BANNERS[activeTab]}
          alt={TAB_LABELS[activeTab]}
          className={styles.banner}
          onError={() => setImgFailed((prev) => ({ ...prev, [activeTab]: true }))}
        />
      )}
      <div className={styles.bannerOverlay}>
        <h2 className={styles.bannerHeadline}>{content.headline}</h2>
        <p className={styles.bannerDescription}>{content.description}</p>
      </div>
      <button
        className={`${styles.bannerNav} ${styles.bannerNavLeft}`}
        onClick={() => {
          const idx = TAB_ORDER.indexOf(activeTab);
          setActiveTab(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length]);
        }}
        aria-label="Previous category"
      >
        <CaretLeft size={18} weight="bold" />
      </button>
      <button
        className={`${styles.bannerNav} ${styles.bannerNavRight}`}
        onClick={() => {
          const idx = TAB_ORDER.indexOf(activeTab);
          setActiveTab(TAB_ORDER[(idx + 1) % TAB_ORDER.length]);
        }}
        aria-label="Next category"
      >
        <CaretRight size={18} weight="bold" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Category Tabs (MDR / NDR)
   ═══════════════════════════════════════════════════════════ */
function CategoryTabs({ activeTab, setActiveTab, productCounts }) {
  return (
    <div className={styles.tabBar}>
      {TAB_ORDER.map((key) => {
        const Icon = TAB_ICONS[key];
        return (
          <button
            key={key}
            className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} weight={activeTab === key ? 'fill' : 'duotone'} />
            {TAB_LABELS[key]}
            {productCounts?.[key] != null && (
              <span className={styles.tabCount}>{productCounts[key]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   "Which MDR Service Is Right for You?" Comparison Table
   ═══════════════════════════════════════════════════════════ */
function Check() {
  return <CheckCircle size={18} weight="fill" className={styles.checkIcon} />;
}
function NoCheck() {
  return <XCircle size={16} weight="regular" className={styles.noCheckIcon} />;
}

function MdrComparisonTable() {
  return (
    <section className={styles.comparisonSection}>
      <h2 className={styles.comparisonHeadline}>Which MDR Service Is Right for You?</h2>
      <p className={styles.comparisonDesc}>
        Not every environment is the same. Some customers already use Microsoft Defender. Others
        want full-stack WatchGuard protection. WatchGuard MDR lets you match the right level of
        protection to each customer.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Core MDR</th>
              <th>Core MDR for Microsoft</th>
              <th>Total MDR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ideal for:</strong></td>
              <td>Using WatchGuard Endpoint</td>
              <td>Using Microsoft Defender</td>
              <td>Using WatchGuard Endpoint, NDR, Identity, Firewall</td>
            </tr>
            <tr>
              <td><strong>24/7 SOC Monitoring</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>AI/ML-based Threat Detection</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Incident Response (Human/Auto)</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Advanced Incident Response</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Threat Hunters</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Defense Portal</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Partner Access to TAM</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Endpoint Integration</strong></td>
              <td>WatchGuard Endpoint</td>
              <td>Microsoft Defender</td>
              <td>WatchGuard Endpoint</td>
            </tr>
            <tr>
              <td><strong>Network Integration</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td>WatchGuard Firebox, ThreatSync NDR</td>
            </tr>
            <tr>
              <td><strong>Identity Integration</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td>WatchGuard AuthPoint</td>
            </tr>
            <tr>
              <td><strong>Microsoft 365</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>AWS CloudTrail Coverage</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Google Workspace</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td><Check /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Protect More with WatchGuard MDR (visual section)
   ═══════════════════════════════════════════════════════════ */
const PROTECT_MORE_ROWS = [
  { attack: 'Stolen Credentials', responseLabel: 'Identity:', responseText: 'Blocks account takeover', protects: 'Identities' },
  { attack: 'Exploits and Malware', responseLabel: 'Endpoint:', responseText: 'Stops malware and isolates endpoints', protects: 'Data at Rest' },
  { attack: 'Lateral Movement', responseLabel: 'Network:', responseText: 'Detects & blocks lateral movement', protects: 'Data in Motion' },
  { attack: 'Cloud Access & Exfiltration', responseLabel: 'Cloud Integration:', responseText: 'Revokes access, resets credentials', protects: 'Applications' },
];

function ProtectMoreSection() {
  return (
    <section className={styles.protectMoreSection}>
      <div className={styles.protectMoreHeader}>
        <h2 className={styles.protectMoreTitle}>Protect More with WatchGuard MDR</h2>
      </div>
      <div className={styles.protectMoreBody}>
        {/* Left columns: attacker + response */}
        <div className={styles.protectLeftCols}>
          {/* Column Headers */}
          <div className={styles.protectColHeaders}>
            <div className={styles.protectColHeader}>
              <span>Attacker Moves</span>
              <WarningOctagon size={18} weight="duotone" className={styles.protectColIconPh} />
            </div>
            <div className={styles.protectColHeader}>
              <span>WatchGuard MDR Stops Them</span>
              <ShieldCheckered size={18} weight="duotone" className={styles.protectColIconPh} />
            </div>
          </div>
          {/* Rows */}
          {PROTECT_MORE_ROWS.map((row, i) => (
            <div key={i} className={styles.protectRow}>
              <div className={styles.chevronLeft}>
                {row.attack}
              </div>
              <div className={styles.chevronRight}>
                <strong>{row.responseLabel}</strong>&nbsp;{row.responseText}
              </div>
            </div>
          ))}
        </div>

        {/* Right column: What Is Protected */}
        <div className={styles.protectedBox}>
          <div className={styles.protectedBoxHeader}>
            <span>What Is Protected</span>
            <MagnifyingGlass size={18} weight="duotone" className={styles.protectColIconPhRight} />
          </div>
          {PROTECT_MORE_ROWS.map((row, i) => (
            <div key={i} className={`${styles.protectedRowCell} ${i % 2 === 1 ? styles.protectedRowAlt : ''}`}>
              {row.protects}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Key Capabilities Section
   ═══════════════════════════════════════════════════════════ */
const KEY_CAPABILITIES = [
  { icon: Eye, title: 'Single View Across Your Security Stack', desc: 'Get a unified view of threat activity across endpoint, identity, network, and cloud activity from one place, saving time and reducing complexity.' },
  { icon: Clock, title: '24/7 Monitoring and Response', desc: 'Our global SOC is always on. Real people and powerful automation work together to detect and stop threats, with security operations across four locations for built-in redundancy.' },
  { icon: Brain, title: 'Smarter Detection with AI/ML', desc: 'AI and machine learning scan thousands of signals in real time, spotting patterns humans might miss and learning how to stop new threats faster.' },
  { icon: Target, title: 'Proactive Threat Hunting', desc: 'Our analysts look for hidden threats that automated tools can miss, so you\'re protected even when attackers try to get clever.' },
  { icon: Lightning, title: 'Fast-Acting Automation', desc: 'We automate the manual review and action, filtering noise, escalating only what matters, and acting quickly to contain threats before they spread.' },
  { icon: Pulse, title: 'Real-Time Visibility', desc: 'The MDR portal gives a live view across your environment into alerts, actions taken, and metrics that show how you\'re protected, all in one place.' },
];

function KeyCapabilitiesSection() {
  return (
    <section className={styles.capabilitiesSection}>
      <h2 className={styles.sectionHeadline}>Key Capabilities</h2>
      <div className={styles.capabilitiesGrid}>
        {KEY_CAPABILITIES.map((cap, i) => (
          <div key={i} className={styles.capabilityCard}>
            <cap.icon size={28} weight="duotone" className={styles.capabilityIcon} />
            <h4 className={styles.capabilityTitle}>{cap.title}</h4>
            <p className={styles.capabilityDesc}>{cap.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Why WatchGuard? Competitive Advantage
   ═══════════════════════════════════════════════════════════ */
const ADVANTAGES = [
  { icon: ShieldStar, title: 'Proven Security Leader', desc: 'Over 25 years in cybersecurity, helping secure over 10 million endpoints across 250,000 organisations worldwide.' },
  { icon: Pulse, title: 'Truly Integrated Security', desc: 'Unlike MDR providers that only monitor endpoint or bolt on cloud support, we bring together endpoint, identity, firewall, and network detection.' },
  { icon: Handshake, title: 'Partner-First Design', desc: 'Built for MSPs and smaller organisations without retrofitting enterprise tools. You stay in control of customer relationships.' },
  { icon: ChartLineUp, title: 'Less Alert Fatigue, More Action', desc: 'Fewer than one false positive per month compared to the 15+/day some vendors generate. Fewer distractions, faster response.' },
  { icon: Lightning, title: 'Faster Time to Protection', desc: 'Quick-start onboarding, pre-built integrations, and strong partner support get you up and running fast.' },
  { icon: Headset, title: 'Proven Tech, Trusted Team', desc: 'Our SOC combines deep security expertise with powerful AI to detect and stop threats fast.' },
];

function WhyWatchGuardSection() {
  return (
    <section className={styles.advantagesSection}>
      <h2 className={styles.sectionHeadline}>Why WatchGuard? Competitive Advantage</h2>
      <div className={styles.advantagesLayout}>
        {/* Left column: Testimonial */}
        <div className={styles.testimonialColumn}>
          <blockquote className={styles.testimonialQuote}>
            &ldquo;We need solutions that are easy to deploy and maintain. We can't afford heavy,
            complicated tools. It frees up time so we can focus on strategic support. We no longer
            have to juggle multiple consoles, which would be unmanageable with a small team.&rdquo;
          </blockquote>
          <cite className={styles.testimonialCite}>— Julien Perret, Eiffie</cite>
        </div>
        {/* Right columns: 6 advantage cards in 2-col grid */}
        <div className={styles.advantagesGrid}>
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className={styles.advantageCard}>
              <adv.icon size={24} weight="duotone" className={styles.advantageIcon} />
              <div>
                <h4 className={styles.advantageTitle}>{adv.title}</h4>
                <p className={styles.advantageDesc}>{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Secure the Full Attack Surface
   ═══════════════════════════════════════════════════════════ */
const SURFACE_ITEMS = [
  { title: 'Endpoint Protection', desc: 'Integrates with WatchGuard Endpoint or supported third-party products to detect behaviours like credential theft and privilege escalation, then isolates compromised devices.', icon: Bug },
  { title: 'Identity Protection', desc: 'Integrates with WatchGuard AuthPoint or Okta to detect and respond to suspicious activity, such as login anomalies or rogue account creation.', icon: ShieldCheckered },
  { title: 'Network Protection', desc: 'Attacks that bypass endpoints, such as lateral movement or C2 traffic, are identified through the Firebox and ThreatSync NDR. Responds by blocking malicious IPs or closing ports.', icon: Shuffle },
  { title: 'Cloud Protection', desc: 'Monitors Microsoft 365 and other cloud platforms for signs of compromise (suspicious sign-ins, permission changes). Responds through API integrations to revoke access or reset credentials.', icon: CloudArrowUp },
];

function AttackSurfaceSection() {
  return (
    <section className={styles.surfaceSection}>
      <h2 className={styles.sectionHeadline}>Secure the Full Attack Surface</h2>
      <div className={styles.surfaceGrid}>
        {SURFACE_ITEMS.map((item, i) => (
          <div key={i} className={styles.surfaceCard}>
            <div className={styles.surfaceImageWrap}>
              <item.icon size={48} weight="duotone" className={styles.surfaceIcon} />
            </div>
            <h4 className={styles.surfaceTitle}>{item.title}</h4>
            <p className={styles.surfaceDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Performance Metrics
   ═══════════════════════════════════════════════════════════ */
function MetricsBar() {
  return (
    <div className={styles.metricsBar}>
      <div className={styles.metric}>
        <span className={styles.metricValue}>&lt;6 min</span>
        <span className={styles.metricLabel}>Mean time to respond</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>&lt;1</span>
        <span className={styles.metricLabel}>False positive per month</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>AI-driven</span>
        <span className={styles.metricLabel}>Threat hunting + automation</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>24/7</span>
        <span className={styles.metricLabel}>Global SOC coverage</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NDR Placeholder Content
   ═══════════════════════════════════════════════════════════ */
function NdrContent() {
  return (
    <div className={styles.ndrPlaceholder}>
      <p className={styles.ndrPlaceholderText}>
        More NDR content coming soon. Check back for detailed feature comparisons,
        capabilities, and deployment guides for ThreatSync+ NDR, Total NDR, and ThreatSync+ SaaS.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main MdrNdrCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function MdrNdrCatalog() {
  const [activeTab, setActiveTab] = useState('mdr');
  const data = useMdrNdrData();
  const { PRODUCTS } = data;
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  const mdrProducts = PRODUCTS.filter((p) => p.group === 'mdr');
  const ndrProducts = PRODUCTS.filter((p) => p.group === 'ndr');
  const activeProducts = activeTab === 'mdr' ? mdrProducts : ndrProducts;
  const content = TAB_CONTENT[activeTab];

  const productCounts = {
    mdr: mdrProducts.length,
    ndr: ndrProducts.length,
  };

  return (
    <div className={styles.catalog}>
      {/* ─── Banner ─── */}
      <MdrNdrBanner activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ─── Category Tabs ─── */}
      <CategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCounts={productCounts}
      />

      {/* ─── Product Cards (3-column) ─── */}
      <div className={styles.productGrid}>
        {activeProducts.map((product) => (
          <ProductCard key={product.key} product={product} data={data} onAdd={handleAdd} />
        ))}
      </div>

      {/* ─── Tab-specific content ─── */}
      {activeTab === 'mdr' && (
        <>
          <MdrComparisonTable />
          <ProtectMoreSection />
          <MetricsBar />
          <KeyCapabilitiesSection />
          <WhyWatchGuardSection />
          <AttackSurfaceSection />
        </>
      )}

      {activeTab === 'ndr' && <NdrContent />}
    </div>
  );
}
