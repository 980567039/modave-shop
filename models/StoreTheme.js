import mongoose from 'mongoose';

const { Schema } = mongoose;

const flexibleSchemaOptions = { _id: false, strict: false };

const imageBlockSchema = new Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    mobileImage: { type: String, default: '' },
    url: { type: String, default: '' },
    link: { type: String, default: '' },
    linkText: { type: String, default: '' },
    alt: { type: String, default: '' },
}, flexibleSchemaOptions);

const contentItemSchema = new Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    imageSrc: { type: String, default: '' },
    imgSrc: { type: String, default: '' },
    mobileImage: { type: String, default: '' },
    link: { type: String, default: '' },
    url: { type: String, default: '' },
    href: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    alt: { type: String, default: '' },
}, flexibleSchemaOptions);

const sizeChartSchema = new Schema({
    uniqueId: { type: String, default: '' },
    title: { type: String, default: '' },
    image: { type: String, default: '' },
}, flexibleSchemaOptions);

const commonThemeSchema = new Schema({
    mainLogo: { type: String, default: '' },
    commonInnerBanner: { type: String, default: '' },
    sizeCharts: { type: [sizeChartSchema], default: [] },
}, flexibleSchemaOptions);

const headerThemeSchema = new Schema({
    slider: { type: [imageBlockSchema], default: [] },
    movingText: { type: Schema.Types.Mixed, default: {} },
    selectedProducts: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const navigationItemSchema = new Schema({
    label: { type: String, default: '' },
    title: { type: String, default: '' },
    href: { type: String, default: '' },
    url: { type: String, default: '' },
    type: { type: String, default: '' },
    children: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const productSectionSchema = new Schema({
    sectionTitle: { type: String, default: '' },
    tagline: { type: String, default: '' },
    viewMoreUrl: { type: String, default: '' },
    linkText: { type: String, default: '' },
    isAutoFetch: { type: Boolean, default: false },
    selectedProducts: { type: [Schema.Types.Mixed], default: [] },
    products: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const categorySectionSchema = new Schema({
    sectionTitle: { type: String, default: '' },
    tagline: { type: String, default: '' },
    viewMoreUrl: { type: String, default: '' },
    linkText: { type: String, default: '' },
    selectedCategories: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const locationSchema = new Schema({
    locationName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    isPickUpLocation: { type: Boolean, default: false },
}, flexibleSchemaOptions);

const storeLocationsSchema = new Schema({
    sectionTitle: { type: String, default: '' },
    locations: { type: [locationSchema], default: [] },
}, flexibleSchemaOptions);

const instagramFeedSchema = new Schema({
    sectionTitle: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    userId: { type: String, default: '' },
    posts: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const homeContentSchema = new Schema({
    marketingBanners: { type: [contentItemSchema], default: [] },
    testimonials: { type: [contentItemSchema], default: [] },
    brands: { type: [contentItemSchema], default: [] },
    blogPosts: { type: [contentItemSchema], default: [] },
    decorativeMedia: { type: [contentItemSchema], default: [] },
}, flexibleSchemaOptions);

const footerThemeSchema = new Schema({
    leftContent: {
        footerLogo: { type: String, default: '' },
        descriptions: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        tiktok: { type: String, default: '' },
    },
    footerMenus: { type: [Schema.Types.Mixed], default: [] },
    highlightedCard: { type: [Schema.Types.Mixed], default: [] },
}, flexibleSchemaOptions);

const storeThemeSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    common: {
        type: commonThemeSchema,
        default: () => ({}),
    },
    header: {
        type: headerThemeSchema,
        default: () => ({}),
    },
    mainNavigation: {
        type: [navigationItemSchema],
        default: [],
    },
    latestArrival: {
        type: productSectionSchema,
        default: () => ({}),
    },
    highlightedCategories: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    selectedFeaturedCategories: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    bestSelling: {
        type: productSectionSchema,
        default: () => ({}),
    },
    trending: {
        type: productSectionSchema,
        default: () => ({}),
    },
    hotSelling: {
        type: productSectionSchema,
        default: () => ({}),
    },
    featuredCollection: {
        type: categorySectionSchema,
        default: () => ({}),
    },
    shopByCategories: {
        type: categorySectionSchema,
        default: () => ({}),
    },
    storeLocations: {
        type: storeLocationsSchema,
        default: () => ({}),
    },
    instagramFeed: {
        type: instagramFeedSchema,
        default: () => ({}),
    },
    homeContent: {
        type: homeContentSchema,
        default: () => ({}),
    },
    footer: {
        type: footerThemeSchema,
        default: () => ({}),
    },

    themeDataObject: Schema.Types.Mixed

}, { timestamps: true });

storeThemeSchema.index({ storeId: 1 });

const StoreTheme = mongoose.models.StoreTheme || mongoose.model('StoreTheme', storeThemeSchema);

export default StoreTheme;
