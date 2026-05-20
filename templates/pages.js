import { getActiveTemplateId } from "@/templates/registry";

import AboutPage from "@/templates/modave/AboutPage";
import CartPage from "@/templates/modave/CartPage";
import CheckoutPage from "@/templates/modave/CheckoutPage";
import CompareProductsPage from "@/templates/modave/CompareProductsPage";
import ContactPage from "@/templates/modave/ContactPage";
import CustomerFeedbackPage from "@/templates/modave/CustomerFeedbackPage";
import FaqPage from "@/templates/modave/FaqPage";
import ForgotPasswordPage from "@/templates/modave/ForgotPasswordPage";
import HomePage from "@/templates/modave/HomePage";
import LoginPage from "@/templates/modave/LoginPage";
import MyAccountAddressPage from "@/templates/modave/MyAccountAddressPage";
import MyAccountOrderDetailsPage from "@/templates/modave/MyAccountOrderDetailsPage";
import MyAccountOrdersPage from "@/templates/modave/MyAccountOrdersPage";
import MyAccountPage from "@/templates/modave/MyAccountPage";
import OrderConfirmPage from "@/templates/modave/OrderConfirmPage";
import OrderFailedPage from "@/templates/modave/OrderFailedPage";
import OrderTrackingPage from "@/templates/modave/OrderTrackingPage";
import ProductDetailPage from "@/templates/modave/ProductDetailPage";
import RegisterPage from "@/templates/modave/RegisterPage";
import ResetPasswordPage from "@/templates/modave/ResetPasswordPage";
import SearchPage from "@/templates/modave/SearchPage";
import ShopPage from "@/templates/modave/ShopPage";
import StoreListPage from "@/templates/modave/StoreListPage";
import TermsPage from "@/templates/modave/TermsPage";

const templatePages = {
  modave: {
    AboutPage,
    CartPage,
    CheckoutPage,
    CompareProductsPage,
    ContactPage,
    CustomerFeedbackPage,
    FaqPage,
    ForgotPasswordPage,
    HomePage,
    LoginPage,
    MyAccountAddressPage,
    MyAccountOrderDetailsPage,
    MyAccountOrdersPage,
    MyAccountPage,
    OrderConfirmPage,
    OrderFailedPage,
    OrderTrackingPage,
    ProductDetailPage,
    RegisterPage,
    ResetPasswordPage,
    SearchPage,
    ShopPage,
    StoreListPage,
    TermsPage,
  },
};

const activeTemplatePages = templatePages[getActiveTemplateId()] || templatePages.modave;

export const {
  AboutPage: ActiveAboutPage,
  CartPage: ActiveCartPage,
  CheckoutPage: ActiveCheckoutPage,
  CompareProductsPage: ActiveCompareProductsPage,
  ContactPage: ActiveContactPage,
  CustomerFeedbackPage: ActiveCustomerFeedbackPage,
  FaqPage: ActiveFaqPage,
  ForgotPasswordPage: ActiveForgotPasswordPage,
  HomePage: ActiveHomePage,
  LoginPage: ActiveLoginPage,
  MyAccountAddressPage: ActiveMyAccountAddressPage,
  MyAccountOrderDetailsPage: ActiveMyAccountOrderDetailsPage,
  MyAccountOrdersPage: ActiveMyAccountOrdersPage,
  MyAccountPage: ActiveMyAccountPage,
  OrderConfirmPage: ActiveOrderConfirmPage,
  OrderFailedPage: ActiveOrderFailedPage,
  OrderTrackingPage: ActiveOrderTrackingPage,
  ProductDetailPage: ActiveProductDetailPage,
  RegisterPage: ActiveRegisterPage,
  ResetPasswordPage: ActiveResetPasswordPage,
  SearchPage: ActiveSearchPage,
  ShopPage: ActiveShopPage,
  StoreListPage: ActiveStoreListPage,
  TermsPage: ActiveTermsPage,
} = activeTemplatePages;
