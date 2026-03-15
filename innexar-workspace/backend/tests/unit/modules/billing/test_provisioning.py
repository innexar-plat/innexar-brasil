"""Unit tests for billing provisioning helpers (_sanitize_hestia_user, _domain_from_line_items)."""

from app.modules.billing.provisioning import (
    _domain_from_line_items,
    _sanitize_hestia_user,
)


class TestSanitizeHestiaUser:
    """Tests for _sanitize_hestia_user."""

    def test_returns_alphanumeric_prefix_and_safe_domain(self) -> None:
        assert _sanitize_hestia_user(1, "example.com") == "cust1_examplecom"
        assert _sanitize_hestia_user(42, "sub.example.com") == "cust42_subexamplecom"

    def test_strips_non_alphanumeric_from_domain(self) -> None:
        assert _sanitize_hestia_user(1, "my-site.com") == "cust1_mysitecom"
        assert _sanitize_hestia_user(2, "a.b.c") == "cust2_abc"

    def test_truncates_to_32_chars(self) -> None:
        long_domain = "a" * 30
        out = _sanitize_hestia_user(1, long_domain)
        assert len(out) <= 32
        assert out.startswith("cust1_")

    def test_lowercase_domain(self) -> None:
        assert _sanitize_hestia_user(1, "EXAMPLE.COM") == "cust1_examplecom"


class TestDomainFromLineItems:
    """Tests for _domain_from_line_items."""

    def test_empty_none(self) -> None:
        assert _domain_from_line_items(None) is None
        assert _domain_from_line_items([]) is None

    def test_list_first_with_domain(self) -> None:
        items = [
            {"description": "Hosting", "amount": 99, "domain": "  site.com  "},
            {"domain": "other.com"},
        ]
        assert _domain_from_line_items(items) == "site.com"

    def test_list_no_domain_returns_none(self) -> None:
        items = [{"description": "Fee", "amount": 10}]
        assert _domain_from_line_items(items) is None

    def test_dict_with_domain(self) -> None:
        assert (
            _domain_from_line_items({"domain": "app.example.com"}) == "app.example.com"
        )

    def test_dict_without_domain_returns_none(self) -> None:
        assert _domain_from_line_items({"description": "x"}) is None
