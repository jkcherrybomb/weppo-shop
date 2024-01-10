--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hash; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public.hash (
    id integer NOT NULL,
    user_id integer NOT NULL,
    hash text NOT NULL
);


ALTER TABLE public.hash OWNER TO weppo_admin;

--
-- Name: hash_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public.hash ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.hash_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public."order" (
    id integer NOT NULL,
    buyer_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    ordered_at timestamp without time zone DEFAULT now() NOT NULL,
    successful boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL,
    completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public."order" OWNER TO weppo_admin;

--
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public."order" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.product OWNER TO weppo_admin;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public.product ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: role; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.role OWNER TO weppo_admin;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public.role ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    balance numeric DEFAULT 0 NOT NULL
);


ALTER TABLE public."user" OWNER TO weppo_admin;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: userrole; Type: TABLE; Schema: public; Owner: weppo_admin
--

CREATE TABLE public.userrole (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.userrole OWNER TO weppo_admin;

--
-- Name: userrole_id_seq; Type: SEQUENCE; Schema: public; Owner: weppo_admin
--

ALTER TABLE public.userrole ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.userrole_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: hash; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public.hash (id, user_id, hash) FROM stdin;
1	1	$2b$10$emtuGhiaukNcdHhgVImbFOeFBgF4ZonOxkeAB3Ra06z6MJ/L/uKQa
2	2	$2b$10$dnn3c76SHhgEjI1CpSLoiu/7hdSotKBEucrjH5ozIHAilst/y7ElG
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public."order" (id, buyer_id, product_id, quantity, ordered_at, successful, completed_at, completed) FROM stdin;
2	1	2	3	2024-01-10 14:00:06.448692	f	2024-01-10 14:00:06.448692	f
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public.product (id, name, price, description, quantity) FROM stdin;
1	Betoniarka	123.45	fajna rzecz	100
2	Kremówka	213.7	xD	2137
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public.role (id, name) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public."user" (id, name, email, balance) FROM stdin;
1	user123	me@the.com	0
2	user456	email@www.pl	0
\.


--
-- Data for Name: userrole; Type: TABLE DATA; Schema: public; Owner: weppo_admin
--

COPY public.userrole (id, user_id, role_id) FROM stdin;
\.


--
-- Name: hash_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.hash_id_seq', 2, true);


--
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.order_id_seq', 2, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.product_id_seq', 3, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.user_id_seq', 6, true);


--
-- Name: userrole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weppo_admin
--

SELECT pg_catalog.setval('public.userrole_id_seq', 1, false);


--
-- Name: hash hash_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.hash
    ADD CONSTRAINT hash_pk PRIMARY KEY (id);


--
-- Name: order order_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pk PRIMARY KEY (id);


--
-- Name: product product_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pk PRIMARY KEY (id);


--
-- Name: role role_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pk PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: userrole userrole_pk; Type: CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_pk PRIMARY KEY (id);


--
-- Name: hash hash_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.hash
    ADD CONSTRAINT hash_user_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_product_fk; Type: FK CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_product_fk FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_fk FOREIGN KEY (buyer_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userrole userrole_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_role_fk FOREIGN KEY (role_id) REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userrole userrole_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: weppo_admin
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_user_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

