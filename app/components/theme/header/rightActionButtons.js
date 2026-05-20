import React, { useState, useEffect, memo, useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import dynamic from 'next/dynamic';
import { LocateIcon, LogOut, Package, Search, User, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiReq } from "@/lib/common";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CartButton from "./cartButton";
import { SiteContext } from "@/app/contexts/siteContexts";
import GlobeSearch from "./globleSearch";
import { IconUser } from "../../svgIcons";
import useMediaQuery from "@/app/hooks/useMediaQuery";

const cache = {};

function RightActionButtons({ isScroll }) {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const { cart } = useContext(SiteContext);
  const router = useRouter();
  const { data: session } = useSession();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const debouncedSearchText = useDebounce(searchText, 600);

  const handlerSearchInput = (text) => {
    setSearchText(text);
  };

  const handleSearch = async (query) => {
    if (query.length > 2) {
      if (cache[query]) {
        setSearchResults(cache[query]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await apiReq(`site/product/search?searchQuery=${query}`, "GET");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const { data } = await res.json();
        cache[query] = data;
        setSearchResults(data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setError("Unable to fetch search results. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    handleSearch(debouncedSearchText);
  }, [debouncedSearchText]);

  return (
    <div className="flex items-center justify-end gap-2">
      <GlobeSearch />
      {/* Account & Cart Buttons */}
      {isDesktop && <div className="hidden lg:block">
        {session ? (
          <>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-12 h-12 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 flex items-center justify-center border-[1px] border-white/50"
                aria-label="Dropdown menu"
              >
                <IconUser
                  fill="#fff"
                  style={{
                    width: 14,
                    height: 14
                  }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-3xl border-0 backdrop-blur-xl p-3 min-w-[200px] bg-black/70 text-white" side="bottom" align="end" >
                <DropdownMenuLabel
                  className="cursor-pointer"
                  onClick={() => router.push("/account")}
                >
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer px-3 rounded-3xl hover:bg-white flex items-center gap-2 w-max"
                  onClick={() => router.push("/account")}
                >
                  <User2 size={10} strokeWidth={1} />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer px-3 rounded-3xl hover:bg-white flex items-center gap-2  w-max"
                  onClick={() => router.push("/account/orders")}
                >
                  <Package size={10} strokeWidth={1} />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer px-3 rounded-3xl hover:bg-white flex items-center gap-2  w-max"
                  onClick={() => router.push("/account/address")}
                >
                  <LocateIcon size={10} strokeWidth={1} />
                  Address
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer px-3 rounded-3xl hover:bg-white flex items-center gap-2  w-max text-red-500"
                  onClick={() => signOut()}
                >
                  <LogOut size={10} strokeWidth={1} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="w-12 h-12 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 flex items-center justify-center border-[1px] border-white/50 hover:bg-transparent"
              onClick={() => router.push("/account")}
              aria-label="Account"
            >
              <IconUser
                fill="#fff"
                style={{
                  width: 14,
                  height: 14
                }}
              />
            </Button>
          </>
        )}
      </div>}
      
      <div>
        <CartButton isScroll={isScroll} cartItems={cart} />
      </div>
    </div>
  );
}

export default memo(RightActionButtons);
